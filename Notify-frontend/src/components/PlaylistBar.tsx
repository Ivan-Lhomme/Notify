import type { PlaylistBarProps } from "../utils/PropsType";

export default function PlaylistBar({
  playlists,
  setPlaylist,
  setPlaylistRoute,
  setRoute,
}: PlaylistBarProps) {
  const createPlaylist = () => {
    setRoute((prev) => {
      return {
        ...prev,
        profile: false,
        playlist: false,
        createPlaylist: true,
      };
    });
  };

  return (
    <div>
      <button onClick={createPlaylist}>+</button>
      {playlists &&
        playlists.map((playlist) => (
          <div
            key={playlist.uuid}
            onClick={() => {
              setPlaylist(playlist);
              setPlaylistRoute();
            }}
          >
            {playlist.name}
          </div>
        ))}
    </div>
  );
}
