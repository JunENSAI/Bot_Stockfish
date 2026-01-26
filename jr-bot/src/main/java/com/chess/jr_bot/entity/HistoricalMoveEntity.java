package com.chess.jr_bot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "moves", schema = "chess_bot")
public class HistoricalMoveEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "game_id")
    private String gameId;

    @Column(nullable = false) 
    private String fen;
    private String turn; // "White" ou "Black"
    
    @Column(name = "move_number")
    private Integer moveNumber;
    
    @Column(name = "played_move")
    private String playedMove;

    // Getters Setters
    public String getPlayedMove() { return playedMove; }
}