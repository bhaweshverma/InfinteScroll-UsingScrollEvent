import "./styles.css";

const factsEle = document.querySelector(".facts");
const loader = document.querySelector(".loader");
const limit = 15;
let currentPage = 1;
let total = 0;

const getDataFromAPI = async (page, limit) => {
  const url = `https://catfact.ninja/facts?page=${page}&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `An errored occured during the api call: ${response.status}`
    );
  }

  return await response.json();
};

const showData = async (data) => {
  data.forEach(function (val, index) {
    const ele = document.createElement("blockData");
    ele.classList.add("fact");
    ele.innerHTML = `${val.fact}`;
    factsEle.appendChild(ele);
  });
};

const showLoader = () => {
  loader.classList.add("show");
};
const hideLoader = () => {
  loader.classList.remove("show");
};

const hasMoreData = (page, limit, total) => {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
};

const loadData = async (page, limit) => {
  showLoader();
  try {
    if (hasMoreData(page, limit, total)) {
      const response = await getDataFromAPI(page, limit);
      showData(response.data);
      total = response.total;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoader();
  }
};

window.addEventListener(
  "scroll",
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 5 &&
      hasMoreData(currentPage, limit, total)
    ) {
      currentPage++;
      loadData(currentPage, limit, total);
    }
  },
  {
    passive: true
  }
);

loadData(currentPage, limit);
