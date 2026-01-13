import { db } from "../src/lib/db";
import { project, lot } from "../src/lib/schema";

async function seed() {
    console.log("Seeding database...");

    // Create Project
    const projectId = "san-matias-adlc";
    await db.insert(project).values({
        id: projectId,
        name: "San Matías Arroyo de La Cruz",
        description: "Barrio exclusivo de 9 hectáreas en Arroyo de la Cruz.",
        location: "Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz",
        totalArea: "9 Hectáreas",
        totalLots: "171",
    }).onConflictDoNothing();

    console.log("Project created.");

    // Create 171 Lots
    const lotsToInsert = [];
    for (let i = 1; i <= 171; i++) {
        lotsToInsert.push({
            id: crypto.randomUUID(),
            projectId,
            number: i.toString(),
            size: "300m2",
            price: "17500",
            status: "available",
        });
    }

    console.log(`Inserting ${lotsToInsert.length} lots...`);

    // Insert in chunks to avoid issues if needed, but 171 is small
    await db.insert(lot).values(lotsToInsert).onConflictDoNothing();

    console.log("Seeding complete!");
}

seed().catch(console.error);
