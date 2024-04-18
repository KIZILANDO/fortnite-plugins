import json

def lire_json_et_extraire_cosmetics(nom_fichier):
    with open(nom_fichier, 'r', encoding='utf-8') as fichier:
        contenu = json.load(fichier)
        if "cosmetics" in contenu:
            return contenu["cosmetics"]
        else:
            return None

def creer_fichier_cosmetics_json(nom_fichier_entree, nom_fichier_sortie):
    cosmetics = lire_json_et_extraire_cosmetics(nom_fichier_entree)
    if cosmetics is not None:
        with open(nom_fichier_sortie, 'w', encoding='utf-8') as fichier_sortie:
            json.dump(cosmetics, fichier_sortie, ensure_ascii=False, indent=4)
        print("Le fichier avec les données 'cosmetics' a été créé avec succès :", nom_fichier_sortie)
    else:
        print("La clé 'cosmetics' n'a pas été trouvée dans le fichier JSON.")

# Exemple d'utilisation :
nom_fichier_entree = "Cosmetics.json"  # Remplacez "donnees.json" par le nom de votre fichier JSON
nom_fichier_sortie = "cosmetics2.json"  # Nom du fichier de sortie pour les données 'cosmetics'

creer_fichier_cosmetics_json(nom_fichier_entree, nom_fichier_sortie)
