import * as fs from "fs";
import * as path from "path";

export type Pet = {
  petType: string;
  name: string;
  color: string;
  timesPetted: number;
  nextPettable: Date;
};

export let pets: Pet[] = [];
export let petsPath: string;

export function setPetsPath(folder: string) {
  petsPath = path.join(folder, "pets.json");
  const dir = path.dirname(petsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function updatePetTimesPetted(pet: Pet) {
  const index = pets.findIndex((p) => p.name === pet.name);
  if (index !== -1) {
    pets[index].timesPetted = pet.timesPetted;
    pets[index].nextPettable = pet.nextPettable;
    savePets();
  }
}

export function loadPetsFile() {
  if (!fs.existsSync(petsPath)) {
    savePets();
  }
  try {
    const data = fs.readFileSync(petsPath, "utf8");
    const loaded = Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
    pets = loaded.map((pet: any) => ({
      ...pet,
      nextPettable: new Date(pet.nextPettable),
    }));
    console.log("Loaded pets", pets);
  } catch {
    pets = [];
  }
}

export function removePet(index: number) {
  if (index >= 0 && index < pets.length) {
    pets.splice(index, 1);
  }
}

export function savePets() {
  fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2));
}
