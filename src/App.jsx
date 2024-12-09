import { useEffect, useState } from 'react'
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Logo from "../public/logo.svg"
import "./App.css"

function App() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [loader, setLoader] = useState(0);

  useEffect(() => {
    setHtml(DOMPurify.sanitize(marked.parse(markdown)));
  }, [markdown]);

  const getPdfByUrl = async (event) => {
    event.preventDefault();

    setLoader(1);

    const res = await fetch("https://pdf2md.joseferalvarez.dev/api/v1/url/", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        url: event.target.url.value
      })
    });

    const data = await res.json();
    setMarkdown(data.file);

    setLoader(0);
  }
  
  return (
    <>
      <div className='converter'>
        <div className='controls'>
          <div className='title'>
            <img className='logo' src={Logo}></img>
            pdf2md
          </div>
          <form className='form-url' onSubmit={(e) => getPdfByUrl(e)}>
            <input type='text' placeholder='Introduce una url' name='url'></input>
            <button type='submit'>Extraer</button>
          </form>
        </div>

        <div className='content'>
          {!html && !loader && <div className='input-text'>Introduce una url para extraer su contenido</div>}
          {loader ?
            <div className='loader-container'>
              <div className="loader"></div>
            </div>
          : ""}
          {html && <div dangerouslySetInnerHTML={{__html: html}}></div>}
        </div>

      </div>
    </>
  )
}

export default App
