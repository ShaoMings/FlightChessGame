package com.game.controller.websocket;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * @author shaoming
 */
@RestController
@RequestMapping("/load")
public class LoadToGame {
    @PostMapping("/game")
    public String loadGame(@RequestParam("target") String target, HttpSession session){
        session.setAttribute("targetUser",target);
        return "ok!";
    }
}
