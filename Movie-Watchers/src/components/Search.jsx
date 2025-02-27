const Search = (props) => {
  const { searchTerm, setSearchTerm } = props;

  return (
    <div className="search">
      <div className="flex">
        <img src="search.svg" alt="Search" className="relative mr-2" />
        <input
          className="ml-3 h-[58px] h-40px text-2xl"
          type="text"
          placeholder="Search Your Movie 🍿🥤"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
