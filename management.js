import { API_LOCAL } from "./config";

let NAME, Name, EMAIL;
menu();
async function menu() {
  const response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status == 401) {
    location.href = "/login/";
  }
  NAME = await response.json();
  Name = NAME.name;
  EMAIL = NAME.email;
  if (NAME) {
    let profile;

    if (NAME.role == "USER") {
      location.href = "/venues/";
    } else if (NAME.role == "ADMIN") {
      location.href = "/admin/";
    }
  }
}

const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

// const switchMode = document.getElementById('switch-mode');

// switchMode.addEventListener('change', function () {
// 	if(this.checked) {
// 		document.body.classList.add('dark');
// 	} else {
// 		document.body.classList.remove('dark');
// 	}
// })

let completedcurrentPage = 1;

// Completed Events
document
  .querySelector("#sidebar .side-menu.top li:nth-child(2) a")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action of anchor tag

    // Hide the chart, admin list, top three boxes, and head title
    document.getElementById("chart").style.display = "none";
    document.querySelector(".todo").style.display = "none";
    document.querySelector(".box-info").style.display = "none";
    document.querySelector(".head-title").style.display = "none";
    document.querySelector(".head").style.display = "none"; // Hide the table head
    document.querySelector(".makehall").style.display = "none";

    // Show the completed events table
    document.querySelector(".filter-options").style.display = "flex";
    document.querySelector("#completed-events-table").style.display = "block";
    document.getElementById("pending-events-table").style.display = "none";
    document.getElementById("failed-events-table").style.display = "none";
    document.querySelector(".order").style.display = "block";

    let tableBody = document.querySelector("#completed-events-table tbody");

    // Sample data to be appended to the table dynamically
    const completedUserData = [
      {
        no: 1,
        hall: "Alpha Hall",
        name: "John",
        collegename: "SEC",
        dept: "CSE",
        email: "john@example.com",
        event: "Event 1",
        date: "02-10-24",
        purpose: "Purpose 1",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 2,
        hall: "Beta Hall",
        name: "Alice",
        collegename: "SIT",
        dept: "ECE",
        email: "alice@example.com",
        event: "Event 2",
        date: "03-15-24",
        purpose: "Purpose 2",
        startTime: "10:00 AM",
        endTime: "06:00 PM",
      },
      {
        no: 3,
        hall: "Gamma Hall",
        name: "Bob",
        collegename: "SEC",
        dept: "IT",
        email: "bob@example.com",
        event: "Event 3",
        date: "04-20-24",
        purpose: "Purpose 3",
        startTime: "11:00 AM",
        endTime: "07:00 PM",
      },
      {
        no: 4,
        hall: "Sigma Hall",
        name: "Eva",
        collegename: "SIT",
        dept: "EEE",
        email: "eva@example.com",
        event: "Event 4",
        date: "05-25-24",
        purpose: "Purpose 4",
        startTime: "12:00 PM",
        endTime: "08:00 PM",
      },
      {
        no: 5,
        hall: "Leo Muthu",
        name: "David",
        collegename: "SEC",
        dept: "CIVIL",
        email: "david@example.com",
        event: "Event 5",
        date: "06-30-24",
        purpose: "Purpose 5",
        startTime: "01:00 PM",
        endTime: "09:00 PM",
      },
      {
        no: 6,
        hall: "VRR Hall",
        name: "Sophia",
        collegename: "SIT",
        dept: "MECH",
        email: "sophia@example.com",
        event: "Event 6",
        date: "07-05-24",
        purpose: "Purpose 6",
        startTime: "02:00 PM",
        endTime: "10:00 PM",
      },
      {
        no: 7,
        hall: "SSR Hall",
        name: "Jack",
        collegename: "SEC",
        dept: "CSE",
        email: "jack@example.com",
        event: "Event 7",
        date: "08-10-24",
        purpose: "Purpose 7",
        startTime: "03:00 PM",
        endTime: "11:00 PM",
      },
      {
        no: 8,
        hall: "SIT AV Hall",
        name: "Lily",
        collegename: "SIT",
        dept: "IT",
        email: "lily@example.com",
        event: "Event 8",
        date: "09-18-24",
        purpose: "Purpose 8",
        startTime: "04:00 PM",
        endTime: "12:00 AM",
      },
      {
        no: 9,
        hall: "SIT Smart Class Room",
        name: "Michael",
        collegename: "SEC",
        dept: "ECE",
        email: "michael@example.com",
        event: "Event 9",
        date: "10-10-24",
        purpose: "Purpose 9",
        startTime: "05:00 PM",
        endTime: "01:00 AM",
      },
      {
        no: 10,
        hall: "SEC AV Hall",
        name: "Emma",
        collegename: "SIT",
        dept: "CSE",
        email: "emma@example.com",
        event: "Event 10",
        date: "11-17-24",
        purpose: "Purpose 10",
        startTime: "06:00 PM",
        endTime: "02:00 AM",
      },
      {
        no: 11,
        hall: "Alpha Hall",
        name: "Oliver",
        collegename: "SEC",
        dept: "IT",
        email: "oliver@example.com",
        event: "Event 11",
        date: "01-01-25",
        purpose: "Purpose 11",
        startTime: "07:00 PM",
        endTime: "03:00 AM",
      },
      {
        no: 12,
        hall: "Beta Hall",
        name: "Charlotte",
        collegename: "SIT",
        dept: "CIVIL",
        email: "charlotte@example.com",
        event: "Event 12",
        date: "02-05-25",
        purpose: "Purpose 12",
        startTime: "08:00 PM",
        endTime: "04:00 AM",
      },
      {
        no: 13,
        hall: "Gamma Hall",
        name: "William",
        collegename: "SEC",
        dept: "MECH",
        email: "william@example.com",
        event: "Event 13",
        date: "03-10-25",
        purpose: "Purpose 13",
        startTime: "09:00 PM",
        endTime: "05:00 AM",
      },
      {
        no: 14,
        hall: "Sigma Hall",
        name: "Amelia",
        collegename: "SIT",
        dept: "EEE",
        email: "amelia@example.com",
        event: "Event 14",
        date: "04-15-25",
        purpose: "Purpose 14",
        startTime: "10:00 PM",
        endTime: "06:00 AM",
      },
      {
        no: 15,
        hall: "Leo Muthu",
        name: "James",
        collegename: "SEC",
        dept: "CSE",
        email: "james@example.com",
        event: "Event 15",
        date: "05-20-25",
        purpose: "Purpose 15",
        startTime: "11:00 PM",
        endTime: "07:00 AM",
      },
      {
        no: 16,
        hall: "VRR Hall",
        name: "Sophia",
        collegename: "SIT",
        dept: "CIVIL",
        email: "sophia2@example.com",
        event: "Event 16",
        date: "06-25-25",
        purpose: "Purpose 16",
        startTime: "12:00 AM",
        endTime: "08:00 AM",
      },
      {
        no: 17,
        hall: "SSR Hall",
        name: "Benjamin",
        collegename: "SEC",
        dept: "ECE",
        email: "benjamin@example.com",
        event: "Event 17",
        date: "07-30-25",
        purpose: "Purpose 17",
        startTime: "01:00 AM",
        endTime: "09:00 AM",
      },
      {
        no: 18,
        hall: "SIT AV Hall",
        name: "Ava",
        collegename: "SIT",
        dept: "MECH",
        email: "ava@example.com",
        event: "Event 18",
        date: "08-05-25",
        purpose: "Purpose 18",
        startTime: "02:00 AM",
        endTime: "10:00 AM",
      },
      {
        no: 19,
        hall: "SIT Smart Class Room",
        name: "Mason",
        collegename: "SEC",
        dept: "CIVIL",
        email: "mason@example.com",
        event: "Event 19",
        date: "09-10-25",
        purpose: "Purpose 19",
        startTime: "03:00 AM",
        endTime: "11:00 AM",
      },
      {
        no: 20,
        hall: "SEC AV Hall",
        name: "Harper",
        collegename: "SIT",
        dept: "CSE",
        email: "harper@example.com",
        event: "Event 20",
        date: "10-15-25",
        purpose: "Purpose 20",
        startTime: "04:00 AM",
        endTime: "12:00 PM",
      },
      {
        no: 21,
        hall: "Alpha Hall",
        name: "Ethan",
        collegename: "SEC",
        dept: "EEE",
        email: "ethan@example.com",
        event: "Event 21",
        date: "11-20-25",
        purpose: "Purpose 21",
        startTime: "05:00 AM",
        endTime: "01:00 PM",
      },
      {
        no: 22,
        hall: "Beta Hall",
        name: "Mia",
        collegename: "SIT",
        dept: "MECH",
        email: "mia@example.com",
        event: "Event 22",
        date: "12-25-25",
        purpose: "Purpose 22",
        startTime: "06:00 AM",
        endTime: "02:00 PM",
      },
      {
        no: 23,
        hall: "Gamma Hall",
        name: "Alexander",
        collegename: "SEC",
        dept: "CSE",
        email: "alexander@example.com",
        event: "Event 23",
        date: "01-01-26",
        purpose: "Purpose 23",
        startTime: "07:00 AM",
        endTime: "03:00 PM",
      },
      {
        no: 24,
        hall: "Sigma Hall",
        name: "Luna",
        collegename: "SIT",
        dept: "CIVIL",
        email: "luna@example.com",
        event: "Event 24",
        date: "02-05-26",
        purpose: "Purpose 24",
        startTime: "08:00 AM",
        endTime: "04:00 PM",
      },
      {
        no: 25,
        hall: "Leo Muthu",
        name: "Sebastian",
        collegename: "SEC",
        dept: "ECE",
        email: "sebastian@example.com",
        event: "Event 25",
        date: "03-10-26",
        purpose: "Purpose 25",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
    ];

    document.getElementById("dept-filter").value = "all";
    document.getElementById("college-filter").value = "all";
    document.getElementById("hall-name-filter").value = "all";

    document
      .getElementById("dept-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("college-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("hall-name-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("start-date")
      .addEventListener("change", function () {
        applyFilters();
      });

    document.getElementById("end-date").addEventListener("change", function () {
      applyFilters();
    });

    function applyFilters() {
      const deptName = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const collegeName = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const hallName = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.querySelector("#start-date").value;
      const endDate = document.querySelector("#end-date").value;

      const filteredData = completedUserData.filter((data) => {
        const matchDept =
          deptName === "all" || data.dept.toLowerCase().trim() === deptName;
        const matchCollege =
          collegeName === "all" ||
          data.collegename.toLowerCase().trim() === collegeName;
        const matchHall =
          hallName === "all" || data.hall.toLowerCase().trim() === hallName;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);

        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Call the showPage function to render the filtered data
      showPage(completedcurrentPage, filteredData);
    }

    $(document).ready(function () {
      // Initialize datepicker for Start Date input
      $("#start-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });

      // Initialize datepicker for End Date input
      $("#end-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });
    });

    let paginationDiv;

    function showPage(pageNumber, getData) {
      // Clear existing content of the table body
      tableBody.innerHTML = "";

      // Calculate start and end indexes for the page
      let startIndex = (pageNumber - 1) * 10;
      let endIndex = startIndex + 10;
      let pageData = getData.slice(startIndex, endIndex);

      // Calculate the starting index for continuous numbering
      let startingIndex = (pageNumber - 1) * 10;

      // Append each row of data to the table dynamically with continuous numbering
      pageData.forEach((data, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
                                <td style="font-weight:bold;">${
                                  startingIndex + i + 1
                                }</td>
                                <td>${data.hall}</td>
                                <td>${data.name}</td>
                                <td>${data.collegename}</td>
                                <td>${data.dept}</td>
                                <td>${data.email}</td>
                                <td>${data.event}</td>
                                <td>${data.date}</td>
                                <td>${data.purpose}</td>
                                <td>${data.startTime}</td>
                                <td>${data.endTime}</td>
                                <td><span class="status completed">Completed</span></td>
                            `;
        tableBody.appendChild(row);
      });
    }

    // Show the first page initially
    showPage(completedcurrentPage, completedUserData);

    // Check if there are more than 10 rows in the table body
    if (
      completedUserData.length > 10 &&
      !document.querySelector("#completed-events-table .pagination")
    ) {
      // Create and append previous and next buttons
      paginationDiv = document.createElement("div");
      paginationDiv.classList.add("pagination");
      paginationDiv.innerHTML = `

                        <button class="prev" onclick="prevPage()">
                            <i class='bx bxs-chevron-left' style='margin-right: 3px; vertical-align: middle;'></i>
                        </button>
                        <span class="page-number" style="font-weight: bold; margin: 0 5px;">${completedcurrentPage}</span>
                        <button class="next" onclick="nextPage()">
                            <i class='bx bxs-chevron-right' style='margin-left: 5px; vertical-align: middle;'></i>
                        </button>


                        
                        `;
      document
        .querySelector("#completed-events-table")
        .appendChild(paginationDiv);

      // Attach event listeners to the buttons
      let prevButton = paginationDiv.querySelector(".prev");
      let nextButton = paginationDiv.querySelector(".next");
      prevButton.addEventListener("click", prevPage);
      nextButton.addEventListener("click", nextPage);
    }

    function prevPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = completedUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Calculate total pages based on filtered data
      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is greater than 1, show the previous page of filtered data
      if (completedcurrentPage > 1) {
        completedcurrentPage--;
        showPage(completedcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function nextPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = completedUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is less than the total pages, show the next page of filtered data
      if (completedcurrentPage < totalPages) {
        completedcurrentPage++;
        showPage(completedcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function updatePaginationButtons() {
      let pageNumberSpan = paginationDiv.querySelector(".page-number");
      pageNumberSpan.textContent = completedcurrentPage;
    }

    // initializePagination(tableBody, eventData);
  });

let pendingcurrentPage = 1;

document
  .querySelector("#sidebar .side-menu.top li:nth-child(3) a")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action of anchor tag

    // Hide the chart, admin list, top three boxes, and head title
    document.getElementById("chart").style.display = "none";
    document.querySelector(".todo").style.display = "none";
    document.querySelector(".box-info").style.display = "none";
    document.querySelector(".head-title").style.display = "none";
    document.querySelector(".head").style.display = "none"; // Hide the table head
    document.querySelector(".filter-options").style.display = "flex";

    document.querySelector("#completed-events-table").style.display = "none";
    document.querySelector(".makehall").style.display = "none";

    document.getElementById("pending-events-table").style.display = "block";
    document.querySelector(".order").style.display = "block";
    document.getElementById("failed-events-table").style.display = "none";

    let tableBody = document.querySelector("#pending-events-table tbody");

    // Sample data to be appended to the table dynamically
    let pendingUserData = [
      {
        no: 1,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 2,
        hall: "Sample Hall",
        name: "sam",
        collegename: "SEC",
        dept: "CSE",
        email: "sam@example.com",
        event: "Sample Event",
        date: "14-11-24",
        purpose: "Children'S Day",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 3,
        hall: "Sample Hall",
        name: "Gowtham",
        collegename: "SIT",
        dept: "IT",
        email: "gowtham@example.com",
        event: "Sample Event",
        date: "22-07-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 4,
        hall: "Sample Hall",
        name: "Praveen",
        collegename: "SIT",
        dept: "IT",
        email: "praveen@example.com",
        event: "Sample Event",
        date: "01-01-24",
        purpose: "New Year",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 5,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 6,
        hall: "Sample Hall",
        name: "sam",
        collegename: "SEC",
        dept: "CSE",
        email: "sam@example.com",
        event: "Sample Event",
        date: "14-11-24",
        purpose: "Children'S Day",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 7,
        hall: "Sample Hall",
        name: "Gowtham",
        collegename: "SIT",
        dept: "IT",
        email: "gowtham@example.com",
        event: "Sample Event",
        date: "22-07-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 8,
        hall: "Sample Hall",
        name: "Praveen",
        collegename: "SIT",
        dept: "IT",
        email: "praveen@example.com",
        event: "Sample Event",
        date: "01-01-24",
        purpose: "New Year",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 9,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 10,
        hall: "Sample Hall",
        name: "sam",
        collegename: "SEC",
        dept: "CSE",
        email: "sam@example.com",
        event: "Sample Event",
        date: "14-11-24",
        purpose: "Children'S Day",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 11,
        hall: "Sample Hall",
        name: "Gowtham",
        collegename: "SIT",
        dept: "IT",
        email: "gowtham@example.com",
        event: "Sample Event",
        date: "22-07-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 12,
        hall: "Sample Hall",
        name: "Praveen",
        collegename: "SIT",
        dept: "IT",
        email: "praveen@example.com",
        event: "Sample Event",
        date: "01-01-24",
        purpose: "New Year",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 13,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 14,
        hall: "Sample Hall",
        name: "sam",
        collegename: "SEC",
        dept: "CSE",
        email: "sam@example.com",
        event: "Sample Event",
        date: "14-11-24",
        purpose: "Children'S Day",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 15,
        hall: "Sample Hall",
        name: "Gowtham",
        collegename: "SIT",
        dept: "IT",
        email: "gowtham@example.com",
        event: "Sample Event",
        date: "22-07-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
    ];

    document.getElementById("dept-filter").value = "all";
    document.getElementById("college-filter").value = "all";
    document.getElementById("hall-name-filter").value = "all";

    document
      .getElementById("dept-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("college-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("hall-name-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("start-date")
      .addEventListener("change", function () {
        applyFilters();
      });

    document.getElementById("end-date").addEventListener("change", function () {
      applyFilters();
    });

    function applyFilters() {
      const deptName = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const collegeName = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const hallName = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.querySelector("#start-date").value;
      const endDate = document.querySelector("#end-date").value;
      // console.log(hallName)

      const filteredData = pendingUserData.filter((data) => {
        const matchDept =
          deptName === "all" || data.dept.toLowerCase().trim() === deptName;
        const matchCollege =
          collegeName === "all" ||
          data.collegename.toLowerCase().trim() === collegeName;
        const matchHall =
          hallName === "all" || data.hall.toLowerCase().trim() === hallName;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        // console.log(matchStartDate)
        // console.log(matchEndDate)
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Call the showPage function to render the filtered data
      showPage(pendingcurrentPage, filteredData);
    }

    $(document).ready(function () {
      // Initialize datepicker for Start Date input
      $("#start-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });

      // Initialize datepicker for End Date input
      $("#end-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });
    });

    let paginationDiv;

    function showPage(pageNumber, getData) {
      // Clear existing content of the table body
      tableBody.innerHTML = "";

      // Calculate start and end indexes for the page
      let startIndex = (pageNumber - 1) * 10;
      let endIndex = startIndex + 10;
      let pageData = getData.slice(startIndex, endIndex);

      // Calculate the starting index for continuous numbering
      let startingIndex = (pageNumber - 1) * 10;

      // Append each row of data to the table dynamically with continuous numbering
      pageData.forEach((data, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
                                <td style="font-weight:bold;">${
                                  startingIndex + i + 1
                                }</td>
                                <td>${data.hall}</td>
                                <td>${data.name}</td>
                                <td>${data.collegename}</td>
                                <td>${data.dept}</td>
                                <td>${data.email}</td>
                                <td>${data.event}</td>
                                <td>${data.date}</td>
                                <td>${data.purpose}</td>
                                <td>${data.startTime}</td>
                                <td>${data.endTime}</td>
                                <td><span class="status pending">Pending</span></td>
                            `;
        tableBody.appendChild(row);
      });
    }

    // Show the first page initially
    showPage(pendingcurrentPage, pendingUserData);

    // Check if there are more than 10 rows in the table body
    if (
      pendingUserData.length > 10 &&
      !document.querySelector("#pending-events-table .pagination")
    ) {
      // Create and append previous and next buttons
      paginationDiv = document.createElement("div");
      paginationDiv.classList.add("pagination");
      paginationDiv.innerHTML = `

                        <button class="prev" onclick="prevPage()">
                            <i class='bx bxs-chevron-left' style='margin-right: 3px; vertical-align: middle;'></i>
                        </button>
                        <span class="page-number" style="font-weight: bold; margin: 0 5px;">${pendingcurrentPage}</span>
                        <button class="next" onclick="nextPage()">
                            <i class='bx bxs-chevron-right' style='margin-left: 5px; vertical-align: middle;'></i>
                        </button>


                        
                        `;
      document
        .querySelector("#pending-events-table")
        .appendChild(paginationDiv);

      // Attach event listeners to the buttons
      let prevButton = paginationDiv.querySelector(".prev");
      let nextButton = paginationDiv.querySelector(".next");
      prevButton.addEventListener("click", prevPage);
      nextButton.addEventListener("click", nextPage);
    }

    function prevPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = pendingUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Calculate total pages based on filtered data
      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is greater than 1, show the previous page of filtered data
      if (pendingcurrentPage > 1) {
        pendingcurrentPage--;
        showPage(pendingcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function nextPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = pendingUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is less than the total pages, show the next page of filtered data
      if (pendingcurrentPage < totalPages) {
        pendingcurrentPage++;
        showPage(pendingcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function updatePaginationButtons() {
      let pageNumberSpan = paginationDiv.querySelector(".page-number");
      pageNumberSpan.textContent = pendingcurrentPage;
    }
  });

let failedcurrentPage = 1;
localStorage.setItem("x", 1);
document
  .querySelector("#sidebar .side-menu.top li:nth-child(4) a")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action of anchor tag

    // Hide the chart, admin list, top three boxes, and head title
    document.getElementById("chart").style.display = "none";
    document.querySelector(".todo").style.display = "none";
    document.querySelector(".box-info").style.display = "none";
    document.querySelector(".head-title").style.display = "none";
    document.querySelector(".head").style.display = "none"; // Hide the table head
    document.querySelector(".filter-options").style.display = "flex";

    document.querySelector("#completed-events-table").style.display = "none";
    document.querySelector(".order").style.display = "block";

    document.getElementById("pending-events-table").style.display = "none";
    document.getElementById("failed-events-table").style.display = "block";
    document.querySelector(".makehall").style.display = "none";

    let tableBody = document.querySelector("#failed-events-table tbody");

    // Sample data to be appended to the table dynamically
    let failedUserData = [
      {
        no: 1,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 2,
        hall: "Sample Hall",
        name: "sam",
        collegename: "SEC",
        dept: "CSE",
        email: "sam@example.com",
        event: "Sample Event",
        date: "14-11-24",
        purpose: "Children'S Day",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 3,
        hall: "Sample Hall",
        name: "Gowtham",
        collegename: "SIT",
        dept: "IT",
        email: "gowtham@example.com",
        event: "Sample Event",
        date: "22-07-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 4,
        hall: "Sample Hall",
        name: "Praveen",
        collegename: "SIT",
        dept: "IT",
        email: "praveen@example.com",
        event: "Sample Event",
        date: "01-01-24",
        purpose: "New Year",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
      {
        no: 5,
        hall: "Sample Hall",
        name: "Jayanth",
        collegename: "SIT",
        dept: "IT",
        email: "jayanth@example.com",
        event: "Sample Event",
        date: "10-10-24",
        purpose: "Audio Launch",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
    ];

    document.getElementById("dept-filter").value = "all";
    document.getElementById("college-filter").value = "all";
    document.getElementById("hall-name-filter").value = "all";

    document
      .getElementById("dept-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("college-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("hall-name-filter")
      .addEventListener("change", function () {
        applyFilters();
      });

    document
      .getElementById("start-date")
      .addEventListener("change", function () {
        applyFilters();
      });

    document.getElementById("end-date").addEventListener("change", function () {
      applyFilters();
    });

    function applyFilters() {
      const deptName = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const collegeName = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const hallName = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.querySelector("#start-date").value;
      const endDate = document.querySelector("#end-date").value;
      // console.log(hallName)

      const filteredData = failedUserData.filter((data) => {
        const matchDept =
          deptName === "all" || data.dept.toLowerCase().trim() === deptName;
        const matchCollege =
          collegeName === "all" ||
          data.collegename.toLowerCase().trim() === collegeName;
        const matchHall =
          hallName === "all" || data.hall.toLowerCase().trim() === hallName;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        // console.log(matchStartDate)
        // console.log(matchEndDate)
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Call the showPage function to render the filtered data
      showPage(failedcurrentPage, filteredData);
    }

    $(document).ready(function () {
      // Initialize datepicker for Start Date input
      $("#start-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });

      // Initialize datepicker for End Date input
      $("#end-date").datepicker({
        dateFormat: "mm/dd/yy", // Day, Month, Year format
        onSelect: function () {
          // Trigger filtering function when a date is selected
          applyFilters();
        },
      });
    });

    let paginationDiv;

    function showPage(pageNumber, getData) {
      // Clear existing content of the table body
      tableBody.innerHTML = "";

      // Calculate start and end indexes for the page
      let startIndex = (pageNumber - 1) * 10;
      let endIndex = startIndex + 10;
      let pageData = getData.slice(startIndex, endIndex);

      // Calculate the starting index for continuous numbering
      let startingIndex = (pageNumber - 1) * 10;

      // Append each row of data to the table dynamically with continuous numbering
      pageData.forEach((data, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
                                <td style="font-weight:bold;">${
                                  startingIndex + i + 1
                                }</td>
                                <td>${data.hall}</td>
                                <td>${data.name}</td>
                                <td>${data.collegename}</td>
                                <td>${data.dept}</td>
                                <td>${data.email}</td>
                                <td>${data.event}</td>
                                <td>${data.date}</td>
                                <td>${data.purpose}</td>
                                <td>${data.startTime}</td>
                                <td>${data.endTime}</td>
                                <td><span class="status failed">Failed</span></td>
                            `;
        tableBody.appendChild(row);
      });
    }

    // Show the first page initially
    showPage(failedcurrentPage, failedUserData);

    // Check if there are more than 10 rows in the table body
    if (
      failedUserData.length > 10 &&
      !document.querySelector("#failed-events-table .pagination")
    ) {
      // Create and append previous and next buttons
      paginationDiv = document.createElement("div");
      paginationDiv.classList.add("pagination");
      paginationDiv.innerHTML = `

                        <button class="prev" onclick="prevPage()">
                            <i class='bx bxs-chevron-left' style='margin-right: 3px; vertical-align: middle;'></i>
                        </button>
                        <span class="page-number" style="font-weight: bold; margin: 0 5px;">${failedcurrentPage}</span>
                        <button class="next" onclick="nextPage()">
                            <i class='bx bxs-chevron-right' style='margin-left: 5px; vertical-align: middle;'></i>
                        </button>


                        
                        `;
      document.querySelector("#failed-events-table").appendChild(paginationDiv);

      // Attach event listeners to the buttons
      let prevButton = paginationDiv.querySelector(".prev");
      let nextButton = paginationDiv.querySelector(".next");
      prevButton.addEventListener("click", prevPage);
      nextButton.addEventListener("click", nextPage);
    }

    function prevPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = failedUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      // Calculate total pages based on filtered data
      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is greater than 1, show the previous page of filtered data
      if (failedcurrentPage > 1) {
        failedcurrentPage--;
        showPage(failedcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function nextPage() {
      let totalPages;
      const validDept = document
        .getElementById("dept-filter")
        .value.toLowerCase()
        .trim();
      const validCollege = document
        .getElementById("college-filter")
        .value.toLowerCase()
        .trim();
      const validHall = document
        .getElementById("hall-name-filter")
        .value.toLowerCase()
        .trim();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Filter the data based on the selected department, college name, hall name, and date range
      let filteredData = failedUserData.filter((data) => {
        const matchDept =
          validDept === "all" || data.dept.toLowerCase().trim() === validDept;
        const matchCollege =
          validCollege === "all" ||
          data.collegename.toLowerCase().trim() === validCollege;
        const matchHall =
          validHall === "all" || data.hall.toLowerCase().trim() === validHall;
        const matchStartDate =
          startDate === "" || new Date(data.date) >= new Date(startDate);
        const matchEndDate =
          endDate === "" || new Date(data.date) <= new Date(endDate);
        return (
          matchDept &&
          matchCollege &&
          matchHall &&
          matchStartDate &&
          matchEndDate
        );
      });

      totalPages = Math.ceil(filteredData.length / 10);

      // If the current page is less than the total pages, show the next page of filtered data
      if (failedcurrentPage < totalPages) {
        failedcurrentPage++;
        showPage(failedcurrentPage, filteredData);
      }

      // Update pagination buttons
      updatePaginationButtons();
    }

    function updatePaginationButtons() {
      // console.log(currentPage)
      let pageNumberSpan = paginationDiv.querySelector(".page-number");
      pageNumberSpan.textContent = failedcurrentPage;
    }
  });

// Completed Events
// Dashboard
document
  .querySelector("#sidebar .side-menu.top li:nth-child(1) a")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action of anchor tag

    // console.log("Dashboard button clicked"); // Log a message to the console

    // Show the chart, admin list, top three boxes, and head title
    document.querySelector("#chart").style.display = "flex";
    document.querySelector(".todo").style.display = "block";
    document.querySelector(".box-info").style.display = "grid";
    document.querySelector(".head-title").style.display = "flex";
    // document.querySelector('.order').style.display = 'block';
    document.querySelector(".head").style.display = "flex"; // Show the table head

    // Hide the completed events table
    document.querySelector("#completed-events-table").style.display = "none";
    document.querySelector("#pending-events-table").style.display = "none";
    document.querySelector("#failed-events-table").style.display = "none";

    document.querySelector(".filter-options").style.display = "none";
    document.querySelector(".makehall").style.display = "none";
  });

document
  .querySelector("#sidebar .side-menu.top li:nth-child(5) a")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("#chart").style.display = "none";
    document.querySelector(".todo").style.display = "none";
    document.querySelector(".box-info").style.display = "none";
    document.querySelector(".head-title").style.display = "none";
    // document.querySelector('.order').style.display = 'block';
    document.querySelector(".head").style.display = "none"; // Show the table head

    // Hide the completed events table
    document.querySelector("#completed-events-table").style.display = "none";
    document.querySelector("#pending-events-table").style.display = "none";
    document.querySelector("#failed-events-table").style.display = "none";

    document.querySelector(".filter-options").style.display = "none";
    document.querySelector(".order").style.display = "none";
    document.querySelector(".makehall").style.display = "block";
    // document.querySelector('#userlogs').innerHTML = 'adfaf';
  });

document
  .getElementById("createHallForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Access form data using id
    const hallName = document.getElementById("hallname").value;
    const campusName = document.getElementById("campusname").value;
    const location = document.getElementById("location").value;
    const projectorAvailable =
      document.getElementById("projectoravailable").value === "yes";
    const acAvailable = document.getElementById("acavailable").value === "yes";
    const seatingCapacity = parseInt(
      document.getElementById("seatingcapacity").value
    );
    const currentlyAvailable =
      document.getElementById("currentlyavailable").value === "yes";

    const fileInput = document.getElementById("file-upload");
    const formData = new FormData();

    formData.append("hallName", hallName);
    formData.append("campusName", campusName);
    formData.append("location", location);
    formData.append("projectorAvailable", projectorAvailable);
    formData.append("acAvailable", acAvailable);
    formData.append("seatingCapacity", seatingCapacity);
    formData.append("currentlyAvailable", currentlyAvailable);

    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("images", fileInput.files[i]);
    }

    // if (fileInput.files.length < 3) {
    //   alert("Please upload at least 3 images");
    //   // return; // Prevent further execution
    // } else
    if (fileInput.files.length > 5) {
      alert("Please upload less than 5 images");
      // return; // Prevent further execution
    } else {
      try {
        // Send request to create a hall
        const response = await fetch(API_LOCAL + "/createHall", {
          mode: "cors",
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (response.status == 401) {
          location.href = "/login/";
          return;
        }
        if (response.status == 200) {
          alert("Hall Created Successfully!");
          return;
        }

        // Handle response
        // ...
      } catch (error) {
        console.error("Error while creating a hall:", error);
      }
    }
  });
document
  .querySelector("#sidebar .side-menu li:nth-child(2) a.logout")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const res = await fetch(API_LOCAL + "/logout", {
      credentials: "include", // Include cookies with the request
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      location.href = "/login/";
    }
  });
