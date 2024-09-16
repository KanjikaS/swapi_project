
$(document).ready(function () {
  var data = JSON.parse(localStorage.getItem("apiData"));
  var endpoint = localStorage.getItem("endpoint");
  let apiUrl = `https://swapi.dev/api/${endpoint}/`;
  let loading = false;
  let nextUrl = null;

  async function fetchAndDisplayData(url) {
    loading = true; 
    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.results) {
        var content = "";
        var items = data.results;
        console.log(items); 

        items.forEach(function (item) {
          var sanitizedName = item.name
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

          content += `<li><h3>${item.name}</h3>`;
          content += `<p><strong>Climate:</strong> ${
            item.climate || "N/A"
          }</p>`;
          content += `<p><strong>Gravity:</strong> ${
            item.gravity || "N/A"
          }</p>`;
          content += "</li>";
        });

        $("#api-details ul").append(content); 

        nextUrl = data.next; 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    loading = false; 
  }

  if (!data) {
    $("#api-details").text("No data available");
    return;
  }

  if (endpoint === "planets") {
    $("#api-details").html("<h2>Details</h2><ul></ul>");
    fetchAndDisplayData(apiUrl); // Fetch and display initial data

    $(window).on("scroll", async function () {
      if (
        !loading &&
        nextUrl &&
        $(window).scrollTop() + $(window).height() >= $(document).height() - 200
      ) {
        // Fetch next page if available and near the bottom
        await fetchAndDisplayData(nextUrl);
      }
    });
  }
  if (endpoint === "films") {
    var content = "<h2>Details</h2>";
    if (data.results) {
      var items = data.results;
      content += "<ul>";
      items.forEach(function (item) {
        content += `<li><h3>${item.title || item.name}</h3>`;
        content += `<p><strong>Director:</strong> ${
          item.director || "N/A"
        }</p>`;
        content += `<p><strong>Release Date:</strong> ${
          item.release_date || "N/A"
        }</p>`;

        if (item.characters) {
          content +=
            '<button class="view-characters" data-characters=\'' +
            JSON.stringify(item.characters) +
            "'>See Characters</button>";
          content += '<div class="character-list"></div>';
        }
        content += "</li>";
      });
      content += "</ul>";
    }

    $("#api-details").html(content);

    $(".view-characters").on("click", function () {
      var characterUrls = JSON.parse($(this).attr("data-characters"));
      if (characterUrls.length > 0) {
        localStorage.setItem("characterUrls", JSON.stringify(characterUrls));
        window.location.href = "characters.html";
      }
    });
  }
  if (endpoint === "people") {
    var content = "<h2>Details</h2>";
    if (data.results) {
      var items = data.results;
      content += "<ul>";

      items.forEach(function (item) {
        var sanitizedName = item.name
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        content += `<li><h3>${item.name}</h3>`;
        content += `<p><strong>Height:</strong> ${item.height || "N/A"}</p>`;
        content += `<p><strong>Gender:</strong> ${item.gender || "N/A"}</p>`;

        if (item.homeworld) {
          content += `<p><strong>Homeworld:</strong> <span class="homeworld-${sanitizedName}">Loading...</span></p>`;

          // Fetch the homeworld asynchronously
          fetch(item.homeworld)
            .then((response) => response.json())
            .then((homeworldData) => {
              console.log(homeworldData);
              // Use sanitized name for the selector
              $(`.homeworld-${sanitizedName}`).text(homeworldData.name);
            })
            .catch((error) => {
              console.error("Error fetching homeworld data:", error);
              $(`.homeworld-${sanitizedName}`).text("Error loading homeworld");
            });
        } else {
          content += `<p><strong>Homeworld:</strong> N/A</p>`;
        }

        content += "</li>";
      });

      content += "</ul>";
    }

    $("#api-details").html(content);
  }
  // if (endpoint === "planets") {
  //     var content = "<h2>Details</h2>";
  //     if (data.results) {
  //         var items = data.results;
  //         content += "<ul>";

  //         items.forEach(function (item) {
  //             // Sanitize the name to make it a valid CSS selector (remove spaces and special chars)
  //             var sanitizedName = item.name.replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  //             content += `<li><h3>${item.name}</h3>`;
  //             content += `<p><strong>climate:</strong> ${item.climate || "N/A"}</p>`;
  //             content += `<p><strong>Gravity:</strong> ${item.gravity || "N/A"}</p>`;

  //             content += "</li>";
  //         });

  //         content += "</ul>";
  //     }

  //     $("#api-details").html(content);
  // }
  if (endpoint === "species") {
    var content = "<h2>Details</h2>";
    if (data.results) {
      var items = data.results;
      content += "<ul>";

      items.forEach(function (item) {
        // Sanitize the name to make it a valid CSS selector (remove spaces and special chars)
        var sanitizedName = item.name
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        content += `<li><h3>${item.name}</h3>`;
        content += `<p><strong>Classification:</strong> ${
          item.classification || "N/A"
        }</p>`;
        content += `<p><strong>Avg Height:</strong> ${
          item.average_height || "N/A"
        }</p>`;

        content += "</li>";
      });

      content += "</ul>";
    }

    $("#api-details").html(content);
  }
  if (endpoint === "starships") {
    var content = "<h2>Details</h2>";
    if (data.results) {
      var items = data.results;
      content += "<ul>";

      items.forEach(function (item) {
        // Sanitize the name to make it a valid CSS selector (remove spaces and special chars)
        var sanitizedName = item.name
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        content += `<li><h3>${item.name}</h3>`;
        content += `<p><strong>model:</strong> ${item.model || "N/A"}</p>`;
        content += `<p><strong>Manufacturer:</strong> ${
          item.manufacturer || "N/A"
        }</p>`;

        content += "</li>";
      });

      content += "</ul>";
    }

    $("#api-details").html(content);
  }
  if (endpoint === "vehicles") {
    var content = "<h2>Details</h2>";
    if (data.results) {
      var items = data.results;
      content += "<ul>";

      items.forEach(function (item) {
        // Sanitize the name to make it a valid CSS selector (remove spaces and special chars)
        var sanitizedName = item.name
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        content += `<li><h3>${item.name}</h3>`;
        content += `<p><strong>model:</strong> ${item.model || "N/A"}</p>`;
        content += `<p><strong>Manufacturer:</strong> ${
          item.manufacturer || "N/A"
        }</p>`;

        content += "</li>";
      });

      content += "</ul>";
    }

    $("#api-details").html(content);
  }
});
