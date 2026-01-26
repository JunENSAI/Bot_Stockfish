package com.chess.jr_bot.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "games", schema = "chess_bot")
public class HistoricalGameEntity {
    @Id
    @Column(name = "game_id")
    private String gameId;

    @Column(name = "white_player")
    private String whitePlayer;

    @Column(name = "black_player")
    private String blackPlayer;

    private String result; // "1-0", "0-1", "1/2-1/2"

    @Column(name = "date_played")
    private LocalDate datePlayed;

    public String getGameId() { return gameId; }
    public String getWhitePlayer() { return whitePlayer; }
    public String getBlackPlayer() { return blackPlayer; }
    public String getResult() { return result; }
}