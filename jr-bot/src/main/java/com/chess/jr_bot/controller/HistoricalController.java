package com.chess.jr_bot.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chess.jr_bot.dto.OpeningStats;
import com.chess.jr_bot.repository.HistoricalRepository;

@RestController
@RequestMapping("/api/historical")
public class HistoricalController {

    private final HistoricalRepository repository;

    public HistoricalController(HistoricalRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/openings")
    public ResponseEntity<?> getOpenings() {
        String historicPlayerName = "JRRZF";

        List<OpeningStats> whiteStats = repository.getWhiteOpeningStats(historicPlayerName);
        List<OpeningStats> blackStats = repository.getBlackOpeningStats(historicPlayerName);

        return ResponseEntity.ok(Map.of(
            "white", whiteStats,
            "black", blackStats
        ));
    }

    private List<Map<String, Object>> enrichStats(List<OpeningStats> rawList, boolean isWhite) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (OpeningStats stat : rawList) {
            Map<String, Object> map = new HashMap<>();
            map.put("move", stat.getMove());
            map.put("fen", stat.getFen());
            map.put("total", stat.getTotal());
            map.put("wins", stat.getWins());
            map.put("draws", stat.getDraws());
            map.put("losses", stat.getLosses());
            
            result.add(map);
        }
        return result;
    }
}