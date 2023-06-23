import React, { useState, useEffect, useRef } from 'react';
import { NavBar,ImportStyle } from './functions';
import { getCategoryFromGensIds } from './functions'
import {BiHeart} from 'react-icons/bi'
import {MdHeartBroken} from 'react-icons/md'
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);//immagine
  const [type, setType] = useState('');//tipo film o serie
  const [data, setData] = useState([]);//array
  const [searchQuery, setSearchQuery] = useState('');//input search
  const [currentPage, setCurrentPage] = useState(1);//stato pagina
  const [isModalOpen, setIsModalOpen] = useState(false); //  stato per il modal
  const itemsPerPage = 20; //num di items per pagina max=40
  const selectedImageRef = useRef(null); //riferimento del imm
  const [dataPreferiti,setDataPreferiti]=useState([])//array preferiti
  const [isClickedPreferito,seTisClickedPreferito]=useState(false) //per la paginazione dei preferiti
  const [maxPageFilm,setMaxPageFilm]=useState(0)
  const [maxPageSerie,setMaxPageSerie]=useState(0)
  const [searchIsClicked,setSearchIsClicked]=useState(false) //per la paginazione della ricerca
  const [genre,setGenre]=useState([]) //per visualizzare il genere 
  
  const [searchData,setsearchData]=useState([])
  const [VotedData,setVotedData]=useState([])
  const [selectedValueLingua, setSelectedValueLingua] = useState('en');
  const { t } = useTranslation();

  const [msgNotFound,setmsgNotFound]=useState(false)

//richiesta dato dal backeand
 useEffect(() => {
     
  const fetchData = async () => {
  try {
    const LanguageAndPage={language:selectedValueLingua,
                           page:currentPage}
    const responseFilm = await axios.get('http://127.0.0.1/stage_php/catalogo/backend/3/discover/movie?', {params: LanguageAndPage});
    const responseSerie = await axios.get('http://127.0.0.1/stage_php/catalogo/backend/3/discover/tv?', {params: LanguageAndPage});
 
    changeMaxPage(responseFilm.data.total_pages,responseSerie.data.total_pages)
    const infoFilm = responseFilm.data.results;
    const infoSerie = responseSerie.data.results;

    const responseData = [];
    infoFilm.forEach((item, index) => {
      const backdrop_path=item.backdrop_path==''?'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path //per eliminare il tempo di attesa in caso di null
      const movie = {
          id: item.id,
          name: item.t_title,
          overview: item.t_overview,
          release_date: item.release_date,
          backdrop_path: backdrop_path,
          vote_average: item.vote_average,
          imgAlt: 'ImgFilm' + index,
          type: 'Movie',
          isPreferito: false,
          vote_count: item.vote_count,
          votato: false,
          votoValue: 0.0,
          id_genre: item.id_genre,
      };
       responseData.push(movie);

    });
  
    infoSerie.forEach((item, index) => {
      const backdrop_path=item.backdrop_path==''?'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg':('https://www.themoviedb.org/t/p/w500'+item.backdrop_path)
      const serieTv = {
        id: item.id,
        name: item.t_name,
        overview: item.t__overview,
        release_date: item.first_air_date,
        backdrop_path: backdrop_path,
        vote_average: item.vote_average,
        imgAlt: 'ImgSerie' + index,
        id_genre: item.id_genre,
        isPreferito: false,
        vote_count: item.vote_count,
        votato: false,
        votoValue:0.0,
        type: 'Serie Tv',
      };
      responseData.push(serieTv);
    });
    setData(responseData);
  } catch (error) {
    console.error(error);
  }
};

fetchData();
 }, [currentPage,type,selectedValueLingua]);

  //per chiudere il modal
  useEffect(() => {
    if (isModalOpen && selectedImage !== null) {
      document.addEventListener('click', handleOutsideClick);
      return () => {
//anulla il voto quando chiude il modal
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isModalOpen, selectedImage]);

  // prelievo preferiti dal local storage
  useEffect(() => {
    if (initialControllLocalStorage('preferiti')) {
      const preferitiData = window.localStorage.getItem("preferiti");
      try {
        
        const parsedData = JSON.parse(preferitiData);
        setDataPreferiti(parsedData);
      } catch (error) {
        console.error("Error parsing preferiti data:", error);
      }
    }
    //prelievo dei votati
    if (initialControllLocalStorage('votedData')) {
      const votedData = window.localStorage.getItem('votedData');
      try {
        const parsedData = JSON.parse(votedData);
        setVotedData(parsedData);
      } catch (error) {
        console.error('Error parsing votedData:', error);
      }
    }
  }, []);
//da modificare
 function fetchGenres(selectedImageData) {
   if ( selectedImageData&&selectedImageData.type){
    const tipo = selectedImageData.type==='Movie'?'movie':'tv'//da eliminare
    axios.get(`http://127.0.0.1/stage_php/catalogo/backend/3/genre/${tipo}/list`)
   //da modificare in axios.post('',{selectedImageData.id_genre:selectedImageData.id_genre,type:selectedImageData.type}) 
      .then(response=>{
        const item = getCategoryFromGensIds(selectedImageData.id_genre,response.data.genres)//da eliminare
        setGenre(item) //setGenre(response)
      })
      .catch(error=>console.log('FETCHGENS ERRORE',error))
  }
 }
 function changeMaxPage(pageF,pageS){
  setMaxPageFilm(pageF)
  setMaxPageSerie(pageS)
 }
 function controll_array(array){
  return Array.isArray(array)
 }
//se non viene cliccato nessun bottone appare sia film che serie, se viene cliccato preferiti appare preferiti
 function initialControll(){
    return isClickedPreferito ? dataPreferiti :  searchIsClicked? searchData : type==='' ? data : filterData();
 }
  //controllo se la localStorage è vuota
  function controll_changeIsPreferiti(){
    const filteredData=initialControll()
    if(initialControllLocalStorage('preferiti')&&controll_array(filteredData)){
      filteredData.forEach(item=>{
      if(dataPreferiti.some(element=>element.id===item.id))
        item.isPreferito=true;     
    }) 
  }
  }
  function initialControllLocalStorage(key){
    return window.localStorage.getItem(key) !== null;
  }
  function controllVoto(){
    const filteredData=initialControll()
    if(initialControllLocalStorage('votedData')&&controll_array(filteredData)){
      filteredData.forEach(item=>{
        if(VotedData.some(element=>element.id===item.id))
          item.votato=true
        else item.votato=false
        VotedData.forEach(element=>{if(element.id===item.id)item.votoValue=element.votoValue})//per aggiornare il votoValue correttamente
      })
    }
  }
  function changePagePreferito(){
    setmsgNotFound(false)
    seTisClickedPreferito(true)
    setSelectedImage(null);
    setSearchIsClicked(false)
    setCurrentPage(1);
  }
  function addPreferiti(item) {
    item.isPreferito=true
    // Verifica se l'oggetto è già presente nell'array dataPreferiti
    const isDuplicate = dataPreferiti.some((preferito) => preferito.id === item.id);
    if (isDuplicate)return
    const newDataPreferiti = [...dataPreferiti, item];
    setDataPreferiti(newDataPreferiti);
    window.localStorage.setItem("preferiti", JSON.stringify(newDataPreferiti));
  }
  function removePreferito(item){
    item.isPreferito=false
    const updatedDataPreferiti = dataPreferiti.filter((element) => element.id !== item.id);
    setDataPreferiti(updatedDataPreferiti);
    window.localStorage.setItem("preferiti", JSON.stringify(updatedDataPreferiti));
  }
  function changetypeFilm() {
    setmsgNotFound(false)
    setType('Movie');
    setSearchIsClicked(false)
    setSelectedImage(null);
    setCurrentPage(1);
    seTisClickedPreferito(false)
  }
  function changeTypeSerie() {
    setmsgNotFound(false)
    setType('Serie Tv');
    setSelectedImage(null);
    setSearchIsClicked(false)
    setCurrentPage(1);
    seTisClickedPreferito(false)

  }
  
  //search del backend se l'input di ricerca nn è vuota
  async function handleSearch(query) {
    setSearchIsClicked(true)
    setSearchQuery(query)
    seTisClickedPreferito(false)
    setSelectedImage(null)
    setType('')
    setCurrentPage(1);
    if (query.trim() !== '') {
      setmsgNotFound(false)
      try {
        const LanguageAndPage={
          page: currentPage,
          query:query,
          language:selectedValueLingua
        }
        const responseFilm = await axios.get('http://127.0.0.1/stage_php/catalogo/backend/3/search/movie?', {params: LanguageAndPage});
        const responseSerie = await axios.get('http://127.0.0.1/stage_php/catalogo/backend/3/search/tv?', {params: LanguageAndPage});

        const infoFilm = responseFilm.data.results;
        const infoSerie = responseSerie.data.results;

        const responseData = [];

        infoFilm.forEach((item, index) => {
          const backdrop_path=item.backdrop_path==''?'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path
          const movie = {
            id: item.id,
            name: item.t_title,
            overview: item.t_overview,
            release_date: item.release_date,
            backdrop_path: backdrop_path,
            vote_average: item.vote_average,
            imgAlt: 'ImgFilm' + index,
            id_genre: item.id_genre,
            vote_count: item.vote_count,
            votato: false,
            votoValue: 0.0,
            type: 'Movie',
          };
          responseData.push(movie);
          setsearchData(responseData);
        });

        infoSerie.forEach((item, index) => {
          const backdrop_path=item.backdrop_path==''?'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path
          const serieTv = {
            id: item.id,
            name: item.t_name,
            overview: item.t__overview,
            release_date: item.first_air_date,
            backdrop_path: backdrop_path,
            vote_average: item.vote_average,
            imgAlt: 'ImgSerie' + index,
            id_genre: item.id_genre,
            vote_count: item.vote_count,
            votato: false,
            votoValue: 0.0,
            type: 'Serie Tv',
          }
           responseData.push(serieTv);
           setsearchData(responseData);
        });
      } catch (error) {
        console.error(error);
      }
    } setmsgNotFound(false)
  }
  //gestione di una pagina (quanti items per pagina)
  function getCurrentPageData() {
    const filteredData = initialControll();
    if (controll_array(filteredData)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      if (isClickedPreferito||searchIsClicked) return filteredData.slice(startIndex, endIndex);
      else return filteredData.slice(0,itemsPerPage)
    }
    return [];
  }
  //filtro prima di stampa
  function filterData() {
    
    if (controll_array(data)) {
      return data.filter((item) => {
        if (searchQuery.trim() !== '') {
          return item.type === type;
        } else { 
          return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            item.type === type
          );
        }
      });
    }
  
    return [];
  }
  //cambio pagina
  function handlePageChange(page) {
    setmsgNotFound(false)
    setCurrentPage(page);
  }
  //  per aprire il modal
  function openModal(index) {
    setSelectedImage(index);
    setIsModalOpen(true);
  }
  //chiusura modal
  function handleOutsideClick(event) {
    if (event.target.className === 'modal') {
      setIsModalOpen(false);
    }
  }
  //...
  function CorpoData() {
    controll_changeIsPreferiti()
    controllVoto()
    const currentPageData = getCurrentPageData();
    return (
      <div className="image-grid">
        {currentPageData.map((item, index) => (
          <div
            className="image-item"
            key={index + (currentPage - 1) * itemsPerPage}
            ref={selectedImage === index ? selectedImageRef : null}
          >
            
              <img
                id={'img' + index}
                src={item.backdrop_path}
                alt={item.imgAlt}
                onClick={() => openModal(index)} // Aggiunto onClick per aprire il modal
              />
            
          </div>
        ))}

        {/* Modal */}
        {isModalOpen && selectedImage !== null && (
          <Modal
            selectedImageData={currentPageData[selectedImage]}
          />
        )}
      </div>
    );
  }
  //paginazione preferiti e ricerca
  function PaginationPreferitiSearch() {
    const filteredData = isClickedPreferito?dataPreferiti:searchData;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];

    if(totalPages == 0) return (<h1 id='notFound'>Not Found any Results</h1>)

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  }
  function Paginazione(){
    const pageNumbers = [];
    //se il tipo è film,massimo di pagina è quello del film,se è del serie,massimo di pagina è quello della serie, altrimenti è la somma
    //let max = type==='film'?maxPageFilm:type==='serie'?maxPageSerie:maxPageFilm+maxPageSerie;
    //console.log(maxPageFilm,maxPageSerie)
    let max = 9
    let end = currentPage + 2;
    let min = 1
    if (end > max) end = max;
    
    for (let i = currentPage; i <= end; i++) {
      pageNumbers.push(i);
    }
    //frecce per tornare nella pagina precedente riga 257
    return (
      <div className="pagination">
        {currentPage!==min&&(<button onClick={()=>handlePageChange(min)}>{'<<'}</button>)}
        {currentPage>min&&(<button onClick={()=>handlePageChange(currentPage-min)}>{'<'}</button>)}
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}

        {currentPage<max&&(<button onClick={()=>handlePageChange(currentPage+min)}>{'>'}</button>)}

        {currentPage!==max&&(<button onClick={()=>handlePageChange(max)}>{'>>'}</button>)}
      </div>
    );
  }
  function Vota({ selectedImageData }) {
    const [isClickVota, setIsClickVota] = useState(false);
    const [votoValue, setVotoValue] = useState('');
    const [errMsgVoto, setErrMsgVoto] = useState(false);

    const handleVotoValueChange = (event) => {
      setVotoValue(event.target.value);
    };
  
    function voto(selectedImageData, value) {
      if (value >= 1 && value <= 10) {
        setErrMsgVoto(false);
        setIsClickVota(false);
        const tipo = selectedImageData.type === 'Movie' ? 'movie' : 'tv';
    
        axios
          .post(`http://127.0.0.1/stage_php/catalogo/backend/3/${tipo}/${selectedImageData.id}/rating`, {'value': `${value}`}, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(function (response) {
            // Aggiornamento dei dati del film dopo il voto
                // aggiungi+controllo
                selectedImageData.votato = true
                selectedImageData.votoValue=value
                const isDuplicate = VotedData.some((votato) => votato.id === selectedImageData.id)
                if (isDuplicate) return
                const newDataVotato = [...VotedData, selectedImageData]
                setVotedData(newDataVotato);
                window.localStorage.setItem('votedData', JSON.stringify(newDataVotato))
                selectedImageData.vote_average = response.data.results[0].vote_average
                selectedImageData.vote_count = response.data.results[0].vote_count
              })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        setErrMsgVoto(true);
      }
    }
  
    const annullaVoto = () => {
      setIsClickVota(false);
      setVotoValue('');
      setErrMsgVoto(false);
    };
  
    const changeBtnVota = () => {
      setIsClickVota(true);
    };
  
    return (
      <div>
        {isClickVota ? (
          <p>
            <input value={votoValue} type="number" onChange={handleVotoValueChange} />
            <button onClick={() => voto(selectedImageData, votoValue)}>{t('Rate It')}</button>
            <button onClick={annullaVoto}>{t('Cancel Rating')}</button>
          </p>
        ) : (
          <button onClick={() => changeBtnVota()}>{t('Rate this ')} {t(selectedImageData.type)}</button>
        )}
        {errMsgVoto && <h2 className='errore'>{t('ERROR')}</h2>}
      </div>
    );
  };
  
    function eliminaVoto(selectedImageData, value) {
      const tipo = selectedImageData.type === 'Movie' ? 'movie' : 'tv';
      
      //value = Vota.votoValue

      axios
        .post(`http://127.0.0.1/stage_php/catalogo/backend/3/${tipo}/${selectedImageData.id}/rating_delete`, {'value': `${value}`}, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(function (response) {
          // Rimuovi il film/serie votato dall'array votedData
          console.log(value)
          const newDataVotato = VotedData.filter((votato) => votato.id !== selectedImageData.id)
          setVotedData(newDataVotato)
          window.localStorage.setItem('votedData', JSON.stringify(newDataVotato))
          selectedImageData.votato = false
          selectedImageData.votoValue=0
          selectedImageData.vote_average = response.data.results[0].vote_average
          selectedImageData.vote_count = response.data.results[0].vote_count
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  //componente
  function DeleteVoto({selectedImageData, votoValue}){
    return(
      <div>
        <button onClick={()=>eliminaVoto(selectedImageData, votoValue)}>{t('Delete Rating')}</button>
      </div>
    );
  }
  // Componente Modal
  function Modal({ selectedImageData }) {
    setGenre(fetchGenres(selectedImageData))//cattura della richiesta per il genere
    if (!selectedImageData) {
      return null; 
    }
    return (
      <div className="modal">
        <div className="modal-content">
            <img src={selectedImageData.backdrop_path}alt='img'></img>
            <h2>
              {selectedImageData.name+'   '} 
              {selectedImageData.isPreferito ? 
              (<button id='remHeart' onClick={()=>removePreferito(selectedImageData)}>{t('- DELETE from FAVORITES')}<MdHeartBroken/></button>)
              :
               <button id='addHeart' onClick={()=>addPreferiti(selectedImageData)}>{t('+ ADD to FAVORITES')}<BiHeart /></button>}
            </h2>
            <h3>{genre}</h3>
            <p>{t('Type')}: {selectedImageData.type}</p>
            <p>{t('Average Rating')}: {selectedImageData.vote_average}/10</p>
            <p>{t('Number of Vote')}: {selectedImageData.vote_count}</p>
            <p>{t('Release Date')}: {selectedImageData.release_date}</p>
            <p>{t('Overview')}: {selectedImageData.overview}</p>
            {selectedImageData.votato&&selectedImageData.votoValue!==0&&(<p>{t('Your Rating')}: {selectedImageData.votoValue}</p>)}
            {selectedImageData.votato&&(<DeleteVoto selectedImageData={selectedImageData} votoValue={selectedImageData.votoValue}/>)}
            {!selectedImageData.votato&&(<Vota selectedImageData={selectedImageData}/>)}
        </div>
      </div>
    );  
  }
  
//font + navbar + corpo + paginazione
  return (
    <div>
      <div id="navDiv">
        <ImportStyle/>
        <NavBar
          changetypeFilm={changetypeFilm}
          changeTypeSerie={changeTypeSerie}
          changePreferito={changePagePreferito}
          handleSearch={handleSearch}
          
          setSelectedValueLingua={setSelectedValueLingua}
          selectedValueLingua={selectedValueLingua}
        />
        </div>
        <div id='mainDiv'>
          {msgNotFound ?
          (<h1 id='notFound'>Not Found any Results</h1>)
           :
          (<CorpoData />)}
        </div>
        <div id='footer'>{(isClickedPreferito||searchIsClicked)?(<PaginationPreferitiSearch/>):(<Paginazione/>)}</div>
      </div>
  );
}