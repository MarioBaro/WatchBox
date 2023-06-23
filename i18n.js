import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Search...': 'Search...', 
      'Search': 'Search',
      'Movie':'Movie',
      'Serie Tv':'Serie Tv',
      'Favorites':'Favorites',
      'Language':'Language',
      'Type ':'Type ',
      'Average Rating ':'Average Rating ',
      'Number of Vote ' : 'Number of Vote ',
      'Release Date':'Release Date',
      'Overview':'Overview',
      'Delete Rating':'Delete Rating',
      'Rate this ':'Rate this ',
      'Rate It':'Rate It',
      'Cancel Rating':'Cancel Rating',
      'ERROR':'ERROR: INSERT VALID VALUE [1-10]',
      '- DELETE from FAVORITES':'-DELETE from FAVORITES',
      '+ ADD to FAVORITES':'+ADD to FAVORITES',
      'Your Rating':'Your Rating'
    },
  },
  it: {
    translation: {
      'Search...': 'Cerca...', 
      'Search': 'Cerca',
      'Movie':'Film',
      'Serie Tv':'Serie Tv',
      'Favorites':'Preferiti',
      'Language':'Lingua',
      'Type':'Tipo',
      'Average Rating':'Voto Medio',
      'Number of Vote' : 'Numero di Voti',
      'Release Date':'Data Uscita',
      'Overview':'Panoramica',
      'Delete Rating':'Elimina Voto',
      'Rate this ':'Vota questo ',
      'Rate It':'Vota',
      'Cancel Rating':'Annulla Voto',
      'ERROR':'ERRORE: INSERISCI VALORE VALIDO [1-10]',
      '- DELETE from FAVORITES':'- ELIMINA dai PREFERITI',
      '+ ADD to FAVORITES':'+ AGGIUNGI ai PREFERITI',
      'Your Rating':'Il tuo Voto'
    },
  },
  zh: {
    translation: {
      'Search...': '搜索中...',
      'Search': '搜索',
      'Movie': '电影',
      'Serie Tv':'电视剧',
      'Favorites':'收藏',
      'Language':'语言',
      'Type':'类型',
      'Average Rating':'评分',
      'Number of Vote':'投票数',
      'Release Date':'上映日期',
      'Overview':'介绍',
      'Delete Rating':'删除评分',
      'Rate this ':'评价这个',
      'Rate It':'提交',
      'Cancel Rating':'取消',
      'ERROR':'请输入有效的评分 [1-10]',
      '- DELETE from FAVORITES':'- 从收藏中删除',
      '+ ADD to FAVORITES':'+ 收藏',
      'Your Rating':'你的评分'
    },
  },
  fr: {
    translation: {
      'Search...':'Recherche...',
      'Movie' : 'Film',
      'Search' : 'Recherche',
      'Serie Tv' : 'Série TV',
      'Favorites' : 'Favoris',
      'Languages' : 'Langue',
      'Type' : 'Taper',
      'Average Vote' : 'Note moyenne',
      'Number of Vote' : 'Nombre de votes ',
      'Release Date' : 'Date de sortie',
      'Overview' : 'Aperçu',
      'Delete Rating' : "Supprimer l'évaluation",
      'Rate this ' : 'Évaluer ce ',
      'Rate It' : 'Notez-le',
      'Cancel Rating' : "Annuler l'évaluation",
      'ERROR' : 'ERREUR : INSÉRER UNE VALEUR VALIDE [1-10]',
      '- DELETE from FAVORITES' : '- SUPPRIMER des FAVORIS',
      '+ ADD to FAVORITES' : '+ AJOUTER AUX FAVORIS',
      'Your Rating' : 'Votre note'
    }
  },
  de: {
    translation: {
      'Search...' : 'Suchen...',
      'Search' : 'Suchen',
      'Movie' : 'Film',
      'Serie Tv' : 'Serie TV',
      'Favorites' : 'Favoriten',
      'Language' : 'Sprache',
      'Type' : 'Typ',
      'Average Rating': 'Durchschnittliche Bewertung',
      'Number of Vote' : 'Anzahl der Stimmen',
      'Release Date' : 'Veröffentlichungsdatum',
      'Overview' : 'Übersicht',
      'Delete Rating' : 'Bewertung löschen',
      'Rate this ' : 'Bewerten',
      'Rate It' : 'Bewerten',
      'Cancel Rating' : 'Bewertung abbrechen',
      'ERROR' : 'FEHLER: GÜLTIG EINFÜGEN WERT [1-10]',
      '- DELETE  from FAVORITES' : '- Aus FAVORITEN LÖSCHEN',
      '+ ADD to FAVORITES':'+ Zu FAVORITEN HINZUFÜGEN',
      'Your Rating': 'Ihre Bewertung'
    }
  },
  es: {
    translation: {
      'Search...' : 'Buscar...', 
      'Search' : 'Buscar',
      'Movie' :  'Película',
      'Serie Tv' : 'Serie Tv', 
      'Favorites' :'Favoritos',
      'Language' : 'Idioma',
      'Type' : 'Tipo',
      'Average Rating' : 'Calificación promedio',
      'Number of Vote' : 'Número de votos',
      'Release Date' : 'Fecha de lanzamiento',
      'Overview' : 'Resumen',
      'Delete Rating' : 'Eliminar calificación',
      'Rate this ' : 'Calificar esto',
      'Rate It' : 'Calificar',
      'Cancel Rating' : 'Cancelar calificación',
      'ERROR' : 'ERROR: INSERTAR VÁLIDO VALOR [1-10]',
      '- DELETE from FAVORITES' : '- ELIMINAR de FAVORITOS',
      '+ ADD to FAVORITES' : '+ AÑADIR a FAVORITOS',
      'Your Rating' : 'Tu Valoración'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;