package com.game.service;

/**
 * @author shaoming
 * 游戏业务处理接口
 */
public interface GameService {
    /**
     *  广播当前位置坐标
     * @param nowPosition 当前位置坐标
     */
   void positionBroadcast(Integer nowPosition);
}
