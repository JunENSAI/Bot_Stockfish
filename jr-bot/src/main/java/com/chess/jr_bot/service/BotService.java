package com.chess.jr_bot.service;

import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.chess.jr_bot.entity.MoveEntity;
import com.chess.jr_bot.repository.MoveRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BotService {

    private final MoveRepository moveRepository;
    private final RestTemplate restTemplate;
    private final Random random = new Random();
    
    // URL du microservice Python
    private final String AI_SERVICE_URL = "http://localhost:5000/analyze?fen=";

    public BotService(MoveRepository moveRepository, RestTemplate restTemplate) {
        this.moveRepository = moveRepository;
        this.restTemplate = restTemplate;
    }

    public String decideMove(String currentFen) {
        String fenKey = currentFen.split(" ")[0];
        
        // 1. RECHERCHE EN MÉMOIRE (Mon style)
        List<MoveEntity> knownMoves = moveRepository.findByFenStartingWith(fenKey);

        if (!knownMoves.isEmpty()) {
            MoveEntity memoryMove = knownMoves.get(random.nextInt(knownMoves.size()));

            if (memoryMove.getEvalScore() != null && memoryMove.getEvalScore() > -200) {
                System.out.println("MODE MÉMOIRE : " + memoryMove.getPlayedMove());
                return memoryMove.getPlayedMove();
            }
            System.out.println("MODE CORRECTION : Coup historique jugé mauvais. Appel à l'IA.");
        } else {
            System.out.println("MODE INCONNU : Position nouvelle. Appel à l'IA.");
        }

        // 2. APPEL À L'IA (Stockfish via Python)
        return askStockfish(currentFen);
    }

    private String askStockfish(String fen) {
        try {
            String response = restTemplate.getForObject(AI_SERVICE_URL + fen, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            
            String bestMove = root.path("best_move").asText();
            System.out.println("STOCKFISH SUGGÈRE : " + bestMove);
            
            return bestMove;
            
        } catch (Exception e) {
            e.printStackTrace();
            return "0000";
        }
    }
}