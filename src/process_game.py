import os
import chess
import chess.pgn
import chess.engine
import pandas as pd
from dotenv import load_dotenv
import sys

load_dotenv()

PGN_FILE = "/home/junior/Fine_Tuning_Stockfish/data_pgn/user_pgn.pgn" 

MY_USERNAME = os.getenv("user_name")

STOCKFISH_PATH = "/usr/games/stockfish" 


DEPTH = 14 

def analyze_pgn():
    print(f"Chargement du moteur Stockfish depuis : {STOCKFISH_PATH}")
    try:
        engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
    except FileNotFoundError:
        print("ERREUR : Stockfish introuvable. Vérifie le chemin STOCKFISH_PATH.")
        return

    data_rows = []
    games_processed = 0
    
    print(f"Lecture du fichier : {PGN_FILE}...")
    
    with open(PGN_FILE) as pgn:
        while True:
            game = chess.pgn.read_game(pgn)
            if game is None:
                break # Fin du fichier

            headers = game.headers
            white = headers.get("White", "?")
            black = headers.get("Black", "?")
            
            # Détermine ta couleur
            if white == MY_USERNAME:
                my_color = chess.WHITE
            elif black == MY_USERNAME:
                my_color = chess.BLACK
            else:
                continue 

            board = game.board()
            games_processed += 1
            if games_processed % 10 == 0:
                print(f"Traitement de la partie n°{games_processed} ({white} vs {black})...")

            for node in game.mainline():
                if board.turn == my_color:

                    info = engine.analyse(board, chess.engine.Limit(depth=DEPTH))
                    
                    best_move = info["pv"][0] if "pv" in info else None
                    score = info["score"].white() # Score vu des blancs
                    
                    if score.is_mate():
                        eval_val = 10000 if score.mate() > 0 else -10000
                    else:
                        eval_val = score.score()

                    data_rows.append({
                        "game_id": f"{headers.get('Date')}_{headers.get('White')}_vs_{headers.get('Black')}",
                        "opening": headers.get("ECO", ""),
                        "fen": board.fen(),
                        "my_move": node.move.uci(),
                        "best_move": best_move.uci() if best_move else "",
                        "score": eval_val,
                        "is_blunder": False
                    })

                board.push(node.move)

    engine.quit()
    
    df = pd.DataFrame(data_rows)
    df.to_csv("dataset_entrainement.csv", index=False)
    print(f"Terminé ! {len(df)} positions analysées sauvegardées dans dataset_entrainement.csv")

if __name__ == "__main__":
    analyze_pgn()