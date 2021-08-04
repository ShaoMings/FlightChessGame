package com.game.controller.websocket;

import com.game.websocket.WebSocketServer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * @author shaoming
 */
@RestController
public class WebSocketController {

    @GetMapping("/send/{targetId}")
    public ResponseEntity<String> sendMessage(String message, @PathVariable("targetId") String targetId) throws IOException {
        WebSocketServer.sendInformationActively(message,targetId);
        return ResponseEntity.ok("信息发送成功!");
    }
}
