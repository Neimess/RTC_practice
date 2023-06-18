function sendRequest(url) {
  const filteredImages = [];
  // Fetch the HTML from the URL and filter the images
    return fetch(url)
      .then(response => response.text())
      .then(html => {
      // Parse the HTML and get the main element
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, 'text/html');
        const mainElement = htmlDoc.getElementsByTagName("main")[0];
        const images = mainElement.getElementsByTagName('img');
         const tegsA = mainElement.getElementsByTagName('a')
        const artistName = mainElement.getElementsByClassName('panel-desc')[0].textContent;
        const hrefs = []
      // Get the hrefs from the main element's a tags
            for (let i = 0; i < tegsA.length; i++) { 
            if (tegsA[i].getAttribute('class') === "opacity") { 
                hrefs.push(tegsA[i].href); 
            } 
            }
      // Replace the local URL with the external URL in the hrefs
          const newHrefs = hrefs.map(href => href.replace(/.*\/album/, "https://gallerix.ru/album")); 
      // Filter the images and return the object with filtered images, artist name, and hrefs
        for (let i = 0; i < images.length; i++) {
          if (images[i].getAttribute('id') === 'xpic' || images[i].getAttribute('class') === 'rb3') {
            filteredImages.push(images[i]);
          }
        }
        // Replace the local URL with the external URL in the hrefs
        const newfilteredImages = filteredImages.map(img => {img.src = img.src.replace("file://", "https://")
        return img;
      })
        return {
          filteredImages: newfilteredImages,
          artistName: artistName,
          hrefs: newHrefs
        };
      })
      .catch(error => console.error(error));
  }
 // Add an event listener to the load button to get the request URL, send the request, and display the filtered images and artist name
  document.getElementById("loadButton").addEventListener("click", () => {
  const requestURL = document.getElementById("URLRequest").value
  sendRequest(requestURL)
  .then(data => {
    const myHeading = document.getElementById("heading_author").style.display = "block";
    
    const gallery = document.getElementById("gallery")
    // Create a figure for each filtered image and display it in the gallery
    for (let i = 0; i < data.filteredImages.length; i++) {
      const figure = document.createElement("figure")
      const img = document.createElement("img")
      img.src = data.filteredImages[i].src
      img.alt = data.filteredImages[i].alt
      // Set the meta data for the image based on its class and href
      img.dataset.meta = (data.filteredImages[i].getAttribute('id') === 'xpic') ?
      requestURL: data.hrefs[i-1]
      // Add an onclick event to open the meta data in a new tab
      img.onclick = () => {
        window.open(img.dataset.meta, '_blank')
      }
      const figCaption = document.createElement("figcaption")
      figCaption.innerHTML = img.alt
      figure.appendChild(img)
      figure.appendChild(figCaption)
      gallery.appendChild(figure)
    }
    // Display the artist name
      const artist = document.getElementById("artist")
      artist.innerHTML = data.artistName
  })
  .catch(error => console.error(error))
  })
  
 // Add an onclick event to each image to open it in a new tab when clicked
const images = document.getElementsByTagName("img");
for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", function() {
    window.open(this.src, '_blank')
  });
}