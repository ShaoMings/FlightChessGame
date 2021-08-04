package com.game.controller.websocket;

import com.game.service.UserService;
import com.game.websocket.WebSocketServer;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * @author shaoming
 */
@RestController
@RequestMapping("/invitation")
public class InvitationUser {
    final UserService userService;

    public InvitationUser(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public void invitation(@RequestParam("source") String source, @RequestParam("target") String target, HttpSession session) throws IOException {
        if (StringUtils.hasText(source) && StringUtils.hasText(target)) {
            session.setAttribute("targetUsername", userService.getByUserId(target).getUsername());
            WebSocketServer.sendInformationActively("invitation:接收来到" + source + "的对战邀请!", target);
        }
    }
}
