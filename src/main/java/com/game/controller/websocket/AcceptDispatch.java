package com.game.controller.websocket;


import com.game.websocket.WebSocketServer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * @author shaoming
 */
@RestController
@RequestMapping("/game")
public class AcceptDispatch {
    @GetMapping("/accept")
    public void acceptAction(@RequestParam("source") String source,@RequestParam("target") String target) throws IOException {
        WebSocketServer.sendInformationActively("accept:ok@"+source,target);
    }
}
