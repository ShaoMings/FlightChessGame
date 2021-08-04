package com.game.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.game.pojo.User;
import com.game.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;


/**
 * @author shaoming
 */
@Controller
@RequestMapping("/admin")
@ResponseBody
public class CrudController {

    @Resource
    UserService userService;

    @GetMapping("/queryAll")
    public String queryAll(){
        List<User> list = userService.list();
        JSONArray jsonArray = JSONObject.parseArray(JSON.toJSONString(list));
        return jsonArray.toJSONString();
    }

    @PostMapping("/add")
    public String addUser(@RequestParam("userId") String userId,
                          @RequestParam("username") String username,
                          @RequestParam("password") String password,
                          @RequestParam("gender") Character gender,
                          @RequestParam("role") String role){
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id",userId).last("limit 1");
        int count = userService.count(queryWrapper);
        boolean isAdded;
        if (count<=0) {
            isAdded = userService.save(new User(0, userId, username, password, gender, role));
        }else {
            isAdded = false;
        }
        return isAdded?"添加成功!":"该用户已存在,添加失败!";
    }

    @GetMapping("/del")
    public String delUser(@RequestParam("id") Integer id){
        boolean isRemoved = userService.removeById(id);
        return isRemoved?"删除成功!":"删除失败!";
    }

    @PostMapping("/update")
    public String updateUser(@RequestParam("id") Integer id,
                             @RequestParam("userId") String userId,
                          @RequestParam("username") String username,
                          @RequestParam("password") String password,
                          @RequestParam("gender") Character gender,
                          @RequestParam("role") String role){
        boolean isAdded = userService.updateById(new User(id,userId, username, password, gender, role));
        return isAdded?"修改成功!":"修改失败!";
    }
}
