#!/usr/bin/env python3
"""
Italian Translation Script for Studio EIM Website
Translates en.html to it.html with comprehensive English-to-Italian mappings
"""

import re
from pathlib import Path

# Read the English HTML file
en_file = Path('/Users/lichsin/Documents/08_AI/GitHub_Repos/web/en.html')
it_file = Path('/Users/lichsin/Documents/08_AI/GitHub_Repos/web/it.html')

print(f"Reading {en_file}...")
html_content = en_file.read_text(encoding='utf-8')
print(f"File size: {len(html_content)} characters")

# Comprehensive English to Italian translation dictionary
# Order matters: longer strings first to avoid partial replacements
translations = {
    # Meta tags and page structure
    '<html lang="en"': '<html lang="it"',
    'hreflang="en"': 'hreflang="it"',
    '<title>Studio EIM - Game Audio Production</title>': '<title>Studio EIM - Produzione Audio per Videogiochi</title>',
    
    # Meta descriptions
    'Game audio production house specializing in orchestral recording, sound design, and voice acting.': 
    'Casa di produzione audio per videogiochi specializzata in registrazione orchestrale, sound design e doppiaggio.',
    
    # OG tags
    '<meta property="og:title" content="Studio EIM - Game Audio Production">':
    '<meta property="og:title" content="Studio EIM - Produzione Audio per Videogiochi">',
    '<meta property="og:description" content="Game audio production house specializing in orchestral recording, sound design, and voice acting.">':
    '<meta property="og:description" content="Casa di produzione audio per videogiochi specializzata in registrazione orchestrale, sound design e doppiaggio.">',
    
    # Language switcher styling
    'id="en-btn"': 'id="it-btn"',
    'id="it-btn"': 'id="en-btn"',
    
    # Main navigation and headers
    '<a href="index.html">Studio EIM</a>': '<a href="index.html">Studio EIM</a>',
    '<a href="en.html">': '<a href="it.html">',
    '<a href="de.html">': '<a href="de.html">',
    '<a href="fr.html">': '<a href="fr.html">',
    '<a href="ja.html">': '<a href="ja.html">',
    '<a href="zh.html">': '<a href="zh.html">',
    
    # Hero section
    'Game Audio Production House': 'Casa di Produzione Audio per Videogiochi',
    'Orchestral Recording • Sound Design • Voice Acting': 'Registrazione Orchestrale • Sound Design • Doppiaggio',
    'Specializing in high-quality game audio production for the gaming industry.': 
    'Specializzati nella produzione audio di alta qualità per l\'industria dei videogiochi.',
    
    # Service sections
    'Orchestral Recording': 'Registrazione Orchestrale',
    'Professional orchestral recording services with world-class musicians and state-of-the-art facilities.': 
    'Servizi professionali di registrazione orchestrale con musicisti di fama mondiale e strutture all\'avanguardia.',
    
    'Sound Design': 'Sound Design',
    'Creating immersive audio environments through meticulous sound design and audio engineering.': 
    'Creazione di ambienti audio immersivi attraverso il sound design meticoloso e l\'ingegneria audio.',
    
    'Voice Acting': 'Doppiaggio',
    'Professional voice recording and localization services for games and interactive media.': 
    'Servizi professionali di registrazione vocale e localizzazione per giochi e media interattivi.',
    
    'BGM Production': 'Produzione Colonna Sonora',
    'Original background music composition and production for game soundtracks.': 
    'Composizione e produzione di musica di sottofondo originale per colonne sonore di videogiochi.',
    
    'SFX Design': 'Progettazione SFX',
    'Custom sound effects design and implementation for dynamic game environments.': 
    'Progettazione e implementazione di effetti sonori personalizzati per ambienti di gioco dinamici.',
    
    # Portfolio/Works section
    'Featured Works': 'Opere in Evidenza',
    'Explore our portfolio of game audio projects': 'Esplora il nostro portfolio di progetti audio per videogiochi',
    
    # Game titles stay the same, but descriptions need translation
    'data-work="Halo"': 'data-work="Halo"',
    
    # About section
    'About Studio EIM': 'Chi Siamo',
    'Leading Game Audio Production Studio': 'Studio Leader nella Produzione Audio per Videogiochi',
    'Since 2010, Studio EIM has been at the forefront of game audio production, delivering exceptional sound design and audio engineering for hundreds of titles across all major platforms.': 
    'Dal 2010, Studio EIM è in prima linea nella produzione audio per videogiochi, fornendo sound design e ingegneria audio eccezionali per centinaia di titoli su tutte le piattaforme principali.',
    
    'Our team of experienced sound designers, composers, and engineers collaborate with developers worldwide to create immersive audio experiences that enhance gameplay and storytelling.': 
    'Il nostro team di sound designer, compositori e ingegneri esperti collabora con sviluppatori in tutto il mondo per creare esperienze audio immersive che migliorano il gameplay e la narrazione.',
    
    'We specialize in orchestral recording, creating authentic orchestral soundtracks with live musicians.': 
    'Siamo specializzati nella registrazione orchestrale, creando colonne sonore orchestrali autentiche con musicisti dal vivo.',
    
    'Our sound design team crafts unique audio landscapes that bring game worlds to life.': 
    'Il nostro team di sound design crea paesaggi audio unici che danno vita ai mondi dei giochi.',
    
    'Professional voice recording services with native speakers and experienced voice directors.': 
    'Servizi professionali di registrazione vocale con madrelingua e direttori vocali esperti.',
    
    # Testimonials
    'What Our Partners Say': 'Cosa Dicono i Nostri Partner',
    'Exceptional audio quality and professionalism. Studio EIM delivered beyond our expectations.': 
    'Qualità audio eccezionale e professionalità. Studio EIM ha superato le nostre aspettative.',
    'The best game audio studio we\'ve worked with. Highly recommend!': 
    'Lo studio audio per videogiochi migliore con cui abbiamo lavorato. Altamente consigliato!',
    'Studio EIM\'s sound design transformed our game\'s audio landscape. Outstanding work!': 
    'Il sound design di Studio EIM ha trasformato il paesaggio audio del nostro gioco. Lavoro straordinario!',
    
    # Contact/CTA
    'Get in Touch': 'Contattaci',
    'Let\'s create amazing audio experiences together.': 
    'Creiamo insieme esperienze audio straordinarie.',
    'Contact Us': 'Contattami',
    'Send Message': 'Invia Messaggio',
    
    # Footer
    'All rights reserved.': 'Tutti i diritti riservati.',
    'Privacy Policy': 'Politica sulla Privacy',
    'Terms of Service': 'Termini di Servizio',
    'Contact': 'Contatti',
    'About': 'Chi Siamo',
    'Services': 'Servizi',
    'Portfolio': 'Portfolio',
    
    # Common UI elements
    'Learn More': 'Scopri di Più',
    'View Portfolio': 'Visualizza Portfolio',
    'Back to Top': 'Torna in Alto',
    'Next': 'Successivo',
    'Previous': 'Precedente',
    'Load More': 'Carica di Più',
    'Subscribe': 'Iscriviti',
    'Submit': 'Invia',
    'Cancel': 'Annulla',
    'Save': 'Salva',
    'Delete': 'Elimina',
    'Edit': 'Modifica',
    'Search': 'Ricerca',
    'Filter': 'Filtra',
    'Sort': 'Ordina',
    'Share': 'Condividi',
    'Download': 'Scarica',
    
    # FAQ and Help
    'Frequently Asked Questions': 'Domande Frequenti',
    'Contact Information': 'Informazioni di Contatto',
    'Phone': 'Telefono',
    'Email': 'Email',
    'Address': 'Indirizzo',
    'Business Hours': 'Orari di Lavoro',
    'Monday - Friday': 'Lunedì - Venerdì',
    '9:00 AM - 6:00 PM': '9:00 - 18:00',
    'Saturday': 'Sabato',
    'Sunday': 'Domenica',
    'Closed': 'Chiuso',
    
    # Experience/Expertise
    'Years of Experience': 'Anni di Esperienza',
    'Industry Leading': 'Leader del Settore',
    'Professional Team': 'Team Professionale',
    'State-of-the-Art Facilities': 'Strutture all\'Avanguardia',
    'Cutting-Edge Technology': 'Tecnologia all\'Avanguardia',
    'Quality Assurance': 'Assicurazione della Qualità',
    
    # Process
    'Our Process': 'Il Nostro Processo',
    'Consultation': 'Consultazione',
    'Planning': 'Pianificazione',
    'Production': 'Produzione',
    'Review': 'Revisione',
    'Delivery': 'Consegna',
    
    # Buttons and CTAs
    'Start Your Project': 'Inizia il Tuo Progetto',
    'Request a Quote': 'Richiedi un Preventivo',
    'Schedule a Call': 'Prenota una Chiamata',
    'Learn More About Our Services': 'Scopri di Più sui Nostri Servizi',
    
    # Language labels
    'English': 'English',
    'Deutsch': 'Deutsch',
    'Français': 'Français',
    '日本語': '日本語',
    '中文': '中文',
    'Italiano': 'Italiano',
}

# Apply translations
content = html_content
for en_text, it_text in translations.items():
    content = content.replace(en_text, it_text)

# Fix the language switcher button styles
# Find and replace the English button to be inactive and Italian button to be active
content = re.sub(
    r'id="en-btn"[^>]*>EN</button>',
    'id="en-btn" onclick="switchLanguage(\'en\')" style="background:transparent;color:var(--text);">EN</button>',
    content
)

content = re.sub(
    r'id="it-btn"[^>]*>IT</button>',
    'id="it-btn" onclick="switchLanguage(\'it\')" style="background:var(--accent);color:white;">IT</button>',
    content
)

# Change href links to it.html where appropriate
content = content.replace('href="en.html"', 'href="it.html"')

# Save the Italian HTML file
print(f"\nWriting to {it_file}...")
it_file.write_text(content, encoding='utf-8')
print(f"Italian file created successfully!")
print(f"File size: {len(content)} characters")
print(f"Translations applied: {len(translations)} entries")
