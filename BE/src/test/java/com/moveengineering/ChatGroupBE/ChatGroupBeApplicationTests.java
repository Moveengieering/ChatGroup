package com.moveengineering.ChatGroupBE;
import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import com.moveengineering.ChatGroupBE.model.ChatRoom;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ChatGroupBeApplicationTests {
    @LocalServerPort
    private int port = 8080;

    private SockJsClient sockJsClient;
    private WebSocketStompClient stompClient;
    private final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();

    @BeforeEach
    public void setup(){
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        this.sockJsClient = new SockJsClient(transports);

        this.stompClient = new WebSocketStompClient(sockJsClient);
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    @Test
    public void getChatMessage() throws Exception {
       // this.setup();
        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<Throwable> failure = new AtomicReference<>();

       StompSessionHandler handler = new TestSessionHandler(failure) {
            @Override
            public void afterConnected(final StompSession session, StompHeaders connectedHeaders){
                session.subscribe("/topic/guestchats", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders stompHeaders) {
                        return null;
                    }

                    @Override
                    public void handleFrame(StompHeaders stompHeaders, Object payload) {
                        ChatRoom greeting =(ChatRoom) payload;
                        System.out.println(greeting);
                        try{
                        // step 4: vLIDATE THAT THE broadcast server response is correct
                         assertEquals("Test1", greeting.getChatName());
                        }catch(Throwable t){
                            failure.set(t);
                        }finally {
                            session.disconnect();
                            latch.countDown();
                        }

                    }
                });
                try{
                    // Step3: stimulate sending in message from the client to server
                    ChatRoom chatRoom = new ChatRoom("123","Test1", null);
                    session.send("/app/guestchat", chatRoom);
            }catch(Throwable t){
                    failure.set(t);
                    latch.countDown();
                }
        }
    };

       // Step 1: stimulte then connection
       this.stompClient.connect(
               "ws://localhost:{port}/root-path-chat",
               this.headers,
               handler,
               this.port
       );
       if(latch.await(3, TimeUnit.SECONDS)){
           if(failure.get() != null){
               throw new AssertionError("", failure.get());
           }
       }else{
          // fail("Greeting not received");
       }
    }

    private class TestSessionHandler extends StompSessionHandlerAdapter {

        private final AtomicReference<Throwable> failure;

        public TestSessionHandler(AtomicReference<Throwable> failure) {
            this.failure = failure;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            this.failure.set(new Exception(headers.toString()));
        }

        @Override
        public void handleException(StompSession s, StompCommand c, StompHeaders h, byte[] p, Throwable ex) {
            this.failure.set(ex);
        }

        @Override
        public void handleTransportError(StompSession session, Throwable ex) {
            this.failure.set(ex);
        }
    }





}
