package com.game.controller.game;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author shaoming
 */
@Controller
public class GameViewController {
    @GetMapping("/game")
    public String game(){
        return "snakeChess";
    }
}
