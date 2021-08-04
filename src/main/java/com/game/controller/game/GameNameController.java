package com.game.controller.game;

import com.game.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

/**
 * @author shaoming
 */
@RestController
@RequestMapping("/game")
public class GameNameController {

    private static final String INVITATION = "invitation:";

    @Autowired
    UserService userService;
    @GetMapping("/name")
    public String getNameAction(@RequestParam("target")String target, HttpSession session){
        if (target.startsWith(INVITATION)){
            target = target.substring(target.indexOf("到")+1,target.indexOf("的"));
        }
        String username = userService.getByUserId(target).getUsername();
        if (StringUtils.hasText(username)){
            session.setAttribute("targetUsername",username);
            return username;
        }else {
            return null;
        }

    }
}
