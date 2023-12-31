const testimonial = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest()

  xhr.open("GET", "https://api.npoint.io/a0d6009fd8302079aa9b", true) // http method, url addres, status async.

  xhr.onload = function () {
    if (xhr.status == 200) {
      resolve(JSON.parse(xhr.response))
    } else {
      reject("Error Loading Data")
    }
  }

  xhr.onerror = function () {
    reject("404 No Connection")
  }

  xhr.send()
})

async function showTestimonial() {
  try {
    const response = await testimonial
    let testimonialForHtml = ""

    response.forEach(item => {
      testimonialForHtml += `
          <div class="testimonial">
            <img src=${item.image} class="profile-testimonial" />
            <p class="quote">${item.comment}</p>
            <p class="author">- ${item.name}</p>
          </div>
        `
    })

    document.getElementById("testimonials").innerHTML = testimonialForHtml
  } catch (err) {
    console.log(err)
  }
}
showTestimonial()


// function for filtering
async function filterTestimonials(rating) {
  try {
    const response = await testimonial
    let testimonialForHtml = ""

    const dataFiltered = response.filter(data => data.rating === rating)
    if (dataFiltered.length === 0) {
      testimonialForHtml = `<h3>Data not found !</h3>`
    } else {
      dataFiltered.forEach(item => {
        testimonialForHtml += `
            <div class="testimonial">
              <img src=${item.image} class="profile-testimonial" />
              <p class="quote">${item.comment}</p>
              <p class="author">- ${item.name}</p>
            </div>
          `
      })
    }

    document.getElementById("testimonials").innerHTML = testimonialForHtml
  } catch (err) {
    console.log(err);
  }
}

function toggleMenu() {
  var listmenu = document.getElementById("listmenu");

  if (listmenu.style.display === "none" || listmenu.style.display === "") {
    listmenu.style.display = "block";
  } else {
    listmenu.style.display = "none";
  }
}