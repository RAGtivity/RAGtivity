import React, { useState, useEffect, useRef } from "react";
import Add_document from "../main/Add_document"
import Send from "../main/Send"
import PropTypes from "prop-types"
import ReactMarkdown from 'react-markdown'

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:4000"

export default function Main({loggedInEmail, onAddDocuments}) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of the conversation container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, isLoading]);

    const handleScroll = (e) => {
        setIsScrolled(e.target.scrollTop > 0);
    };

    const handleSendQuery = async (queryText) => {
        if (!queryText.trim()) return;
        
        setIsLoading(true);
        
        //add user question to conversation
        const newConversation = [...conversation, { type: 'question', content: queryText }];
        setConversation(newConversation);
        setQuery('');
        
        // Add a placeholder for the AI response
        setConversation(prev => [...prev, { 
            type: 'answer', 
            content: '', 
            sources: [] 
        }]);

        try {
            // Get streaming response from the backend
            const response = await fetch(BACKEND_ENDPOINT + '/rag/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: queryText }),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error('Failed to query RAG pipeline');
            }
            
            // Use reader and decoder since response will be a stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = '';
            
            // Iterate through the reader until all chunked responses are streamed
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                // Chunked messages are ended with a [BREAK] signal
                const lines = buffer.split('[BREAK]');
                // Keep text after [BREAK] in case that the chunk message ends before the intended [BREAK]
                buffer = lines.pop(); 
                
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    // If line is empty, continue
                    if (!trimmedLine) continue;
                    if (trimmedLine === "[DONE]") continue;
                    
                    try {
                        // Data is a JSON of {answer, sources}
                        const data = JSON.parse(trimmedLine);
                        
                        setConversation(prev => {
                            // Keep previous conversation
                            const newConv = [...prev];
                            const lastIdx = newConv.length - 1;
                            
                            const updatedMessage = { ...newConv[lastIdx] };
                            
                            // data.answer contains the new message from the stream response
                            if (data.answer) {
                                updatedMessage.content += data.answer;
                            }
                            
                            // Handle data source
                            if (data.sources && data.sources.length > 0) {
                                const existingSources = updatedMessage.sources || [];
                                const newSources = data.sources.filter(ns => 
                                    !existingSources.some(es => 
                                        JSON.stringify(es) === JSON.stringify(ns)
                                    )
                                );
                                updatedMessage.sources = [...existingSources, ...newSources];
                            }
                            
                            // Set new conversation
                            newConv[lastIdx] = updatedMessage;
                            return newConv;
                        });
                    } catch (e) {
                        console.error("Error parsing stream JSON", e, "Line:", trimmedLine);
                    }
                }
            }
            
        } catch (error) {
            console.error('Query failed:', error);
            // If fails, generate failed text instead
            setConversation(prev => {
                const newConv = [...prev];
                const lastIdx = newConv.length - 1;
                if (newConv[lastIdx].type === 'answer' && !newConv[lastIdx].content) {
                    newConv[lastIdx].content = 'Failed to get response. Please try again.';
                }
                return newConv;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendQuery(query);
        }
    };

    const hasConversation = conversation.length > 0 || isLoading;

    return (
        <div className="w-full h-screen flex flex-col items-center bg-121212 p-8 pt-0">
            <div className="w-full max-w-4xl flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-8 pt-8 pb-4 relative">
                    <p className="text-4xl font-medium">Interactive RAG</p>
                    <p className="text-white/60">Build your own AI knowledge</p>
                    {/* Gradient Border Bottom */}
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'} bg-linear-to-r from-transparent via-gray-500 to-transparent`} />
                </div>
                
                {/* Default State - Input in middle */}
                {!hasConversation && (
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex bg-lightgrey px-2 py-2 rounded-lg gap-4">
                            <Add_document 
                                onAddDocuments={onAddDocuments} 
                                userEmail={loggedInEmail}
                            />
                            <input 
                                type="text" 
                                name="query" 
                                id="query" 
                                value={query}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask your AI..."
                                className="flex-grow pr-4 focus:outline-none bg-transparent text-white"
                            />
                            <Send 
                                onSend={() => handleSendQuery(query)} 
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                )}
                
                {/* Conversation State - Input at bottom */}
                {hasConversation && (
                    <>
                        {/* Conversation Area - Scrollable */}
                        <div 
                            className="flex-1 overflow-auto space-y-4 mb-6"
                            onScroll={handleScroll}
                        >
                            {conversation.map((item, index) => (
                                <div key={index} className="w-full">
                                    {item.type === 'question' ? (
                                        //User Question
                                        <div className="mb-4 flex justify-end">
                                            <div className="bg-blue-600 text-white rounded-lg p-4 inline-block max-w-3xl">
                                                <p>{item.content}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        //AI Response
                                        <div className="bg-lightgrey/20 rounded-lg p-4 w-9/10 mb-4">
                                            <div className="mb-4 prose prose-invert max-w-none">
                                                <ReactMarkdown>{item.content}</ReactMarkdown>
                                            </div>
                                            
                                            {/* Sources Section */}
                                            {item.sources && item.sources.length > 0 && (
                                                <div className="border-t border-white/20 pt-4">
                                                    <h4 className="text-md font-medium mb-2 text-white/90">Sources</h4>
                                                    <div className="space-y-2">
                                                        {item.sources.map((source, sourceIndex) => (
                                                            <div key={sourceIndex} className="bg-white/5 rounded p-3">
                                                                {typeof source === 'string' ? (
                                                                    <p className="text-white/70 text-sm">{source}</p>
                                                                ) : (
                                                                    <>
                                                                        {source.chunk_id && (
                                                                            <p className="text-white/90 font-medium text-sm mb-1">
                                                                                📄 {source.chunk_id}
                                                                            </p>
                                                                        )}
                                                                        {source.content && (
                                                                            <p className="text-white/70 text-sm">
                                                                                {source.content.length > 200 
                                                                                    ? `${source.content.substring(0, 200)}...` 
                                                                                    : source.content
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {source.page && (
                                                                            <p className="text-white/50 text-xs mt-1">
                                                                                Page: {source.page}
                                                                            </p>
                                                                        )}
                                                                        {source.score && (
                                                                            <p className="text-white/50 text-xs">
                                                                                Relevance: {(source.score * 100).toFixed(1)}%
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="text-center">
                                    <p className="text-white/60">Thinking...</p>
                                </div>
                            )}

                            {/* This div is at the bottom of the conversation container, so it will scroll to the bottom when conversation is loading */}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Input Area - Fixed at bottom */}
                        <div className="flex bg-lightgrey px-2 py-2 rounded-lg gap-4">
                            <Add_document 
                                onAddDocuments={onAddDocuments} 
                                userEmail={loggedInEmail}
                            />
                            <input 
                                type="text" 
                                name="query" 
                                id="query" 
                                value={query}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder={isLoading ? "Processing..." : "Ask your AI..."} 
                                className="flex-grow pr-4 focus:outline-none bg-transparent text-white"
                                disabled={isLoading}
                            />
                            <Send 
                                onSend={() => handleSendQuery(query)} 
                                isLoading={isLoading}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}


Main.propTypes = {
    loggedInEmail: PropTypes.string.isRequired,
    onAddDocuments: PropTypes.func.isRequired
}