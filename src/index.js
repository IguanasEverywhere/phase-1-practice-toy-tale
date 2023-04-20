let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCardContainer = document.querySelector("#toy-collection");
  const addToyForm = document.querySelector('.add-toy-form');

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  // FETCH ALL TOYS FROM DB
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toyData => {
      toyData.forEach(toy => {
        appendToyToPage(makeCard(toy))
      });
    });


  // MAKE CARD WITH TOY OBJECT FROM DB
  function makeCard(toy) {
    let toyCard = document.createElement('div');
    toyCard.classList.add('card');


    let toyName = document.createElement('h2');
    toyName.textContent = toy.name;
    toyCard.append(toyName);

    let toyImg = document.createElement('img');
    toyImg.src = toy.image;
    toyImg.classList.add('toy-avatar');
    toyCard.append(toyImg);

    let toyLikes = document.createElement('p');
    toyLikes.id = `likes-${toy.id}`;
    toyLikes.textContent = `${toy.likes} Likes`;
    toyCard.append(toyLikes);

    let likeBtn = document.createElement('button');
    likeBtn.textContent = "LIKE";
    likeBtn.classList.add('like-btn');
    likeBtn.setAttribute('id', `likeBtn-${toy.id}`);
    likeBtn.addEventListener('click', () => {
      updateLikes(toy.id);
    });

    toyCard.append(likeBtn);
    return toyCard;
  }


  // CREATE NEW TOY OBJECT AND POST IT TO DB
  addToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let nameInputVal = document.querySelector('input[name=name]').value;
    let toyImageUrlInputVal = document.querySelector('input[name=image]').value;

    let newToyObj = {
      name: nameInputVal,
      image: toyImageUrlInputVal,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToyObj)
    })
      .then(res => res.json())
      .then(toyData => appendToyToPage(makeCard(toyData)))
  });


  // APPEND A TOYCARD TO THE DOM
  function appendToyToPage(toyCard) {
    toyCardContainer.append(toyCard);
  }

  // UPDATE THE LIKES ON A TOY
  function updateLikes(toyId) {
    let currentLikes;
    fetch(`http://localhost:3000/toys/${toyId}`)
      .then(res => res.json())
      .then(toy => {
        currentLikes = toy.likes;
        fetch(`http://localhost:3000/toys/${toyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            'likes': currentLikes + 1
          })
        })
        .then(response => response.json())
        .then(newData => {
          console.log(newData);
          let likeDOMDisplay = document.querySelector(`#likes-${toyId}`)
          likeDOMDisplay.textContent = `${newData.likes} Likes`
        })
      })
  }

});
