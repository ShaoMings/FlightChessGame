package com.game.pojo;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author shaoming
 */
@TableName("user")
@Data
@AllArgsConstructor
public class User {
    private Integer id;
    private String userId;
    private String username;
    private String password;
    private Character gender;
    private String role;
}
