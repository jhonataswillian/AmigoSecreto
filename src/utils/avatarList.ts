export const AVATAR_PATHS = [
  // Pets
  "/assets/images/pets/fofo1.png",
  "/assets/images/pets/fofo2.png",
  "/assets/images/pets/fofo3.png",
  "/assets/images/pets/fofo4.png",
  "/assets/images/pets/fofo5.png",
  "/assets/images/pets/fofo6.png",
  "/assets/images/pets/fofo7.png",
  "/assets/images/pets/fofo8.png",
  "/assets/images/pets/fofo9.png",
  "/assets/images/pets/fofo10.png",
  "/assets/images/pets/fofo11.png",
  "/assets/images/pets/fofo12.png",
  // Natal
  "/assets/images/natal/natal1.png",
  "/assets/images/natal/natal2.png",
  "/assets/images/natal/natal3.png",
  "/assets/images/natal/natal4.png",
  "/assets/images/natal/natal5.png",
  "/assets/images/natal/natal6.png",
  "/assets/images/natal/natal7.png",
  "/assets/images/natal/natal8.png",
  "/assets/images/natal/natal9.png",
  "/assets/images/natal/natal10.png",
  "/assets/images/natal/natal11.png",
  "/assets/images/natal/natal12.png",
];

export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * AVATAR_PATHS.length);
  return AVATAR_PATHS[randomIndex];
};
