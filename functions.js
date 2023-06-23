import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import _ from 'lodash';
import axios from 'axios';

import { FilmBtn } from './navbarBtn_Film';
import { SerieBtn } from './navBarBtn_Serie';
import { PreferitoBtn } from './navBarBtn_Preferiti';
import { BiRefresh } from 'react-icons/bi';

export function NavBar({ changetypeFilm, changeTypeSerie, handleSearch, changePreferito,setSelectedValueLingua }) {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const [responseLanguage, setResponseLanguage] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [idName, setIdName] = useState('listLanguage');
  const [languageName, setLanguageName] = useState('English');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchValue);
  };

  const changeLanguage = (Language) => {
    i18n.changeLanguage(Language)
      .then(() => {
        // La lingua è stata cambiata con successo
      })
      .catch((error) => {
        // Errore durante il cambio della lingua
        console.error(error);
      });
  };

  const handleLanguageChange = (event) => {
    const inputText = event.target.value.toLowerCase();
    const newSuggestions = responseLanguage.filter((item) =>
      item.nome.toLowerCase().startsWith(inputText)
    );
    setSuggestions(newSuggestions);
    setSelectedValueLingua(event.target.value);
    setLanguageName(event.target.value);
  };
  
  const choseLanguage = (value) => {
    setSelectedValueLingua(value.prefisso);
    setLanguageName(value.nome);
    setSuggestions([]);
    changeLanguage(value.prefisso);
  };

  const handleKeyDown = (event) => {
    if (suggestions.length > 0) {
      if (event.keyCode === 9) {
        event.preventDefault();
        const value = _.sortBy(suggestions, 'nome')[0];
        choseLanguage(value);
      } else {
        setLanguageName(event.target.value);
      }
    }
  };
  
  useEffect(()=>{
    function requestLanguages(){
      const arrayLanguage=[]
       
      axios
        .get('http://127.0.0.1/stage_php/catalogo/backend/3/configuration/languages')
        .then(function (response) {
          const responseData = response.data.results
          responseData.forEach((item)=>{
              const lingua={
                prefisso:item.iso_639_1,
                nome:item.name
              }
              if(lingua.prefisso === 'it' ||
              lingua.prefisso === 'en' ||
              lingua.prefisso === 'es' ||
              lingua.prefisso === 'fr' ||
              lingua.prefisso === 'de' ||
              lingua.prefisso === 'pt' ||
              lingua.prefisso === 'ru' ||
              lingua.prefisso === 'ar' ||
              lingua.prefisso === 'zh'
              )
              arrayLanguage.push(lingua)
          })
          setResponseLanguage(arrayLanguage)
        })
        .catch(function (error) {
          console.error(error);
        });
          }
    requestLanguages()
  },[])
  

  return (
    <nav>
      <ul>
        <li>
          <FilmBtn changetypeFilm={changetypeFilm}
          />
        </li>
        <li>
          <SerieBtn changeTypeSerie={changeTypeSerie}
          />
        </li>
        <li>
          <PreferitoBtn changePreferito={changePreferito}/>
        </li>

        <li><h1 id='titleWeb'>WatchBox</h1></li>

        <li>
          <div id='search'>
          <form onSubmit={handleFormSubmit}>
            <button type="submit">{t('Search')}<FiSearch /></button>
            <input type="text" value={searchValue} onChange={handleInputChange} placeholder={t('Search...')} />
          </form>
          </div>
        </li>

        <li id='listLanguage'>
          <button>{t('Language: ')}
            <Autocomplete
              value={languageName}
              suggestions={suggestions}
              handleLanguageChange={handleLanguageChange}
              choseLanguage={choseLanguage}
              handleKeyDown={handleKeyDown}
              idName={idName}
              setIdName={setIdName}
            />
          </button>
        </li>
        
      </ul>
    </nav>
  );
}
function Autocomplete({ value, suggestions, handleLanguageChange, choseLanguage, handleKeyDown, idName ,setIdName}) {
  return (
    <span>
      <input type='text' value={value} onChange={handleLanguageChange} onKeyDown={handleKeyDown} />
      <div id={idName}>
        {suggestions.length === 0 ? (
          <ul>
          <li>{setIdName('suggestionsIsEmpty')}</li>
        </ul>
        ) : (
          suggestions.map((item) => (
            <ul key={item.prefisso}>
              <li id={'selectLingua'}value={item.prefisso} onClick={() => choseLanguage(item)}>{item.nome}</li>
            </ul>
          ))
        )}
      </div>
    </span>
  );
}

export function ImportStyle(){
  return <style>@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap'); </style>
}
export function getCategoryFromGensIds(numbers, dataBase) {
  const genreNames = [];
  if (Array.isArray(numbers)) {
    for (let number of numbers) {
      const categoryItem = dataBase.find(item => item.id === number);
      if (categoryItem) {
        genreNames.push(categoryItem.name);
      }
    }
  }
  return genreNames.join('-');
}