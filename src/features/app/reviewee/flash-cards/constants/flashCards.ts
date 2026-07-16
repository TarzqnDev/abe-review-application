import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

export const FLASH_CARD_AREAS = ["Area 1", "Area 2", "Area 3"] as const;

export const FLASH_CARD_DECKS: FlashCardDeck[] = [
  {
    id: "area-1-fundamentals",
    area: "Area 1",
    title: "Electrical Fundamentals",
    updatedAt: "July 14, 2026",
    questions: [
      {
        id: "ohms-law",
        question: "What relationship does Ohm's law describe?",
        answer: "Voltage equals current multiplied by resistance (V = IR).",
      },
      {
        id: "power-unit",
        question: "What is the SI unit of electrical power?",
        answer: "The watt.",
      },
      {
        id: "series-current",
        question: "What remains constant in a series circuit?",
        answer: "Current remains the same through every component.",
      },
    ],
  },
  {
    id: "area-2-machines",
    area: "Area 2",
    title: "Electrical Machines",
    updatedAt: "July 12, 2026",
    questions: [
      {
        id: "transformer-purpose",
        question: "What is the primary function of a transformer?",
        answer: "To transfer electrical energy between circuits by induction.",
      },
      {
        id: "motor-conversion",
        question: "What energy conversion occurs in an electric motor?",
        answer: "Electrical energy is converted into mechanical energy.",
      },
      {
        id: "generator-conversion",
        question: "What energy conversion occurs in a generator?",
        answer: "Mechanical energy is converted into electrical energy.",
      },
      {
        id: "slip-definition",
        question: "What does slip describe in an induction motor?",
        answer: "The difference between synchronous and rotor speed.",
      },
      {
        id: "dc-motor-back-emf",
        question: "What produces back EMF in a DC motor?",
        answer: "Rotation of the armature conductors in the magnetic field.",
      },
    ],
  },
  {
    id: "area-3-codes",
    area: "Area 3",
    title: "Codes and Safety",
    updatedAt: "July 9, 2026",
    questions: [
      {
        id: "grounding-purpose",
        question: "Why is electrical equipment grounded?",
        answer: "To provide a safe path for fault current and reduce shock risk.",
      },
      {
        id: "ppe-purpose",
        question: "What is the purpose of electrical PPE?",
        answer: "To reduce exposure to electrical and arc-flash hazards.",
      },
    ],
  },
];
