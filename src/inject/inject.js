const UNDEFINED = 'undefined';

const pullComments = (profData, toAdd) => {
  toAdd.setAttribute("title", "What people are saying!");
  toAdd.setAttribute("data-toggle", "popover");
  toAdd.setAttribute("data-trigger", "hover");
  toAdd.setAttribute("data-placement", "left");
  toAdd.setAttribute("data-container", "body");
  const content = displayMostRecentComments(profData);
  if (content === -1) {
    toAdd.setAttribute("data-content", "No recent comments");
  } else {
    toAdd.setAttribute("data-content", content);
  }
  return toAdd;
};

const displayTooltip = toAdd => {
  toAdd.setAttribute(
    "title",
    "Hover over Overall Rating to see recent comments"
  );
  toAdd.setAttribute("data-toggle", "tooltip");
  toAdd.setAttribute("data-trigger", "hover");
  toAdd.setAttribute("data-placement", "top");
  toAdd.setAttribute("data-container", "body");
  return toAdd;
};

const displayMostRecentComments = profData => {
  let comments = "";
  let i = 0;
  if (profData.latestComments.length === 0) return -1;
  for (let j = 0; j < profData.latestComments.length; j++) {
    comments += `${i + 1}. ${profData.latestComments[i]}<br /><br />`;
    i++;
    if (i === 3) break;
  }
  return comments;
};

const appendRatingHeader = () => {
  const ratingHeader = document.createElement('th');
  ratingHeader.innerText = "Overall Rating";
  document.getElementById("sectionStartHeader").firstElementChild.firstElementChild.appendChild(ratingHeader);
  const saltLakeCenterCol = document.querySelector(".smalltitle");
  if (saltLakeCenterCol != null && saltLakeCenterCol != undefined) {
    saltLakeCenterCol.setAttribute('colspan', 22);
  }
}

const getProfessorIndexFromTable = professorDisplay => {
  let j = 0;
  for (j; j < professorDisplay.length; j++) {
    if (professorDisplay[j].innerText == "Instructor") {
      return j;
    }
  }
  return j - 1;
}

const scrapeProfessorNames = (rows, professorTableIndex) => {
  let profArray = []
  for (let row of rows) {
    profArray.push(
      row.getElementsByTagName("td")[professorTableIndex].innerText.trim()
    );
    row.appendChild(document.createElement("td"));
  }
  return profArray;
}

const addLabRowPadding = labRows => {
  for (let row of labRows) {
    row.appendChild(document.createElement("td"));
  }
}

const addProfessorQualityColor = (quality, ratingLink) => {
  const HIGH_QUALITY = 3.9;
  const AVERAGE = 2.8;
  if (quality > HIGH_QUALITY) {
    ratingLink.classList.add("high_quality");
  } else if (quality > AVERAGE) {
    ratingLink.classList.add("average");
  } else {
    ratingLink.classList.add("poor");
  }
}

const addRatingLink = (rows, response, i) => {
  const ratingLink = document.createElement('a');
  ratingLink.innerText = response[i].overallQuality;
  ratingLink = pullComments(response[i], ratingLink);
  addProfessorQualityColor(response[i].overallQuality, ratingLink);
  const len = rows[i].getElementsByTagName("td").length;
  rows[i].getElementsByTagName("td")[len - 1].append(ratingLink);
}

const addProfessorLink = (rows, response, i) => {
  const professorLink = document.createElement('a');
  professorLink.setAttribute("href", response[i].link);
  professorLink.setAttribute("target", "_blank");
  professorLink.classList.add("professor_link");
  professorLink.innerText = rows[i].getElementsByTagName("td")[professorIndex].innerText;
  rows[i].getElementsByTagName("td")[professorIndex].innerText = "";
  rows[i].getElementsByTagName("td")[professorIndex].append(professorLink);
}

const getRatingsFromRateMyProfessor = (profArray, rows, professorIndex) => {
  chrome.runtime.sendMessage(profArray, function (response) {
    if (response !== UNDEFINED) {
      for (let i = 0; i < profArray.length; i++) {
        if (typeof response[i] != UNDEFINED) {
          addProfessorLink(rows, response, i);
          addRatingLink(rows, response, i);
        } else {
          const len = rows[i].getElementsByTagName("td").length;
          rows[i].getElementsByTagName("td")[len - 1].innerText = "No Info";
        }
      }
      // Enable the elements tooltip and popover
      $(function () {
        $('[data-toggle="popover"]').popover({
          html: true
        });
      });
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
    }
  });
}

chrome.extension.sendMessage({}, function (_) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      appendRatingHeader();
      addLabRowPadding(document.querySelectorAll(".labSectionRow"));
      const rows = document.querySelectorAll(".sectionsRow");
      const professorIndex = getProfessorIndexFromTable(professorDisplay);
      const professorDisplay = document.getElementById("sectionStartHeader").firstElementChild.firstElementChild.getElementsByTagName("th");
      const profArray = scrapeProfessorNames(rows, professorIndex);
      getRatingsFromRateMyProfessor(profArray, rows, professorIndex);
    }
  }, 1);
});