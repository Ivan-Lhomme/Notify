import type { UpperBarProps } from "../utils/PropsType";

export default function UpperBar({ setRoute }: UpperBarProps) {
  const home = () => {
    setRoute({
      profile: false,
      playlist: false,
    });
  };

  const profile = () => {
    setRoute({
      profile: true,
      playlist: false,
    });
  };

  return (
    <div>
      <button onClick={home}>🏠</button>
      <input type="search" name="searchBar" id="searchBar" />
      <button onClick={profile}>Profile</button>
    </div>
  );
}
