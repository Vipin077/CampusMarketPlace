package com.campusmarketplace.server.config;

import com.campusmarketplace.server.security.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    // =========================================================
    // MESSAGE BROKER CONFIGURATION
    // =========================================================

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry config
    ) {

        // Server -> Client
        config.enableSimpleBroker(
                "/topic",
                "/queue"
        );

        // Client -> Server
        config.setApplicationDestinationPrefixes(
                "/app"
        );

        // Private user-specific messages
        config.setUserDestinationPrefix(
                "/user"
        );
    }

    // =========================================================
    // WEBSOCKET ENDPOINT
    // =========================================================

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        registry
                .addEndpoint("/ws")
                .setAllowedOriginPatterns(
                        "http://localhost:5173"
                )
                .withSockJS();
    }

    // =========================================================
    // JWT AUTHENTICATION FOR WEBSOCKET
    // =========================================================

    @Override
    public void configureClientInboundChannel(
            ChannelRegistration registration
    ) {

        registration.interceptors(
                webSocketAuthInterceptor
        );
    }
}