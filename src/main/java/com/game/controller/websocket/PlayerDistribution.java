package com.game.controller.websocket;

import com.game.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

/**
 * @author shaoming
 */
@RestController
public class PlayerDistribution {

    @Autowired
    UserService userService;

    @PostMapping("/distribution")
    public String distribution(@RequestParam("player1") String player1, @RequestParam("player2") String player2, HttpSession session){
        session.setAttribute("distribution","player1@"+player1+"#player2@"+player2);
        session.setAttribute("distributionUsername","playerName1@"+userService.getByUserId(player1).getUsername()+"#playerName2@"+userService.getByUserId(player2).getUsername());
        return "ok!";
    }
}
