package com.chess.jr_bot.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chess.jr_bot.dto.GameSave;
import com.chess.jr_bot.entity.GameEntity;
import com.chess.jr_bot.repository.GameRepository;

@RestController
@RequestMapping("/api/platform")
@CrossOrigin(origins = "*")
public class GameController {

    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // --- 1. SAUVEGARDE  ---
    @PostMapping("/save")
    public ResponseEntity<?> saveGame(@RequestBody GameSave request) {
        try {
            GameEntity game = new GameEntity();
            game.setWhitePlayer(request.getWhitePlayer());
            game.setBlackPlayer(request.getBlackPlayer());
            game.setResult(request.getResult());
            game.setPgnText(request.getPgn());
            game.setTimeControl(request.getTimeControl() != null ? request.getTimeControl() : "Standard");
            game.setDatePlayed(LocalDateTime.now());

            gameRepository.save(game);

            return ResponseEntity.ok(Map.of("message", "Partie sauvegardée avec succès !"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de la sauvegarde.");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPlayerStats(@RequestParam String username) {
        List<GameEntity> games = gameRepository.findByWhitePlayerOrBlackPlayer(username, username);

        int wins = 0;
        int losses = 0;
        int draws = 0;

        for (GameEntity g : games) {
            if ("1/2-1/2".equals(g.getResult())) {
                draws++;
            } else if ((username.equals(g.getWhitePlayer()) && "1-0".equals(g.getResult())) ||
                       (username.equals(g.getBlackPlayer()) && "0-1".equals(g.getResult()))) {
                wins++;
            } else {
                losses++; 
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("username", username);
        stats.put("totalGames", games.size());
        stats.put("wins", wins);
        stats.put("losses", losses);
        stats.put("draws", draws);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/history")
    public ResponseEntity<List<GameEntity>> getPlayerHistory(@RequestParam String username) {
        List<GameEntity> history = gameRepository.findTop50ByWhitePlayerOrBlackPlayerOrderByDatePlayedDesc(username, username);
        return ResponseEntity.ok(history);
    }
}