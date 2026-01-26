package com.chess.jr_bot.dto;

public interface OpeningStats {
    String getMove();
    String getFen();
    Long getTotal();
    Long getWins();
    Long getDraws();
    Long getLosses();
}