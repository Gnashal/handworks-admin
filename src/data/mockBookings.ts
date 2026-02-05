import { IFetchAllBookingsResponse } from "@/types/booking";

export const mockBookings: IFetchAllBookingsResponse = {
  totalBookings: 13,
  bookingsRequested: 13,
  bookings: [
    {
      id: "bk_001",
      base: {
        id: "bk_001",
        custId: "cust_001",
        customerFirstName: "Juan",
        customerLastName: "Dela Cruz",
        address: {
          addressHuman: "123 Ayala Ave, Makati, NCR",
          addressLat: 14.554729,
          addressLng: 121.024445,
        },
        startSched: "2026-02-06T09:00:00Z",
        endSched: "2026-02-06T12:00:00Z",
        dirtyScale: 3,
        paymentStatus: "PAID",
        reviewStatus: "PENDING",
        photos: [
          "https://example.com/photos/bk_001_1.jpg",
          "https://example.com/photos/bk_001_2.jpg",
        ],
        createdAt: "2026-02-01T08:15:00Z",
        updatedAt: "2026-02-03T10:30:00Z",
        quoteId: "q_001",
      },
      mainService: {
        id: "svc_001",
        serviceType: "GENERAL_CLEANING",
        details: {
          homeType: "CONDO",
          sqm: 45,
        },
      },
      addons: [
        {
          id: "addon_001",
          serviceDetail: {
            id: "svc_001_addon_1",
            serviceType: "COUCH",
            details: {
              cleaningSpecs: [
                {
                  couchType: "2-SEATER",
                  widthCm: 160,
                  depthCm: 80,
                  heightCm: 90,
                  quantity: 1,
                },
              ],
              bedPillows: 0,
            },
          },
          price: 800,
        },
      ],
      equipments: [
        {
          id: "eq_001",
          name: "Vacuum Cleaner",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/vacuum.jpg",
        },
        {
          id: "eq_002",
          name: "Mop",
          type: "MANUAL",
          photoUrl: "https://example.com/equipment/mop.jpg",
        },
      ],
      resources: [
        {
          id: "res_001",
          name: "All-purpose Cleaner",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/cleaner.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_001",
          cleanerFirstName: "Maria",
          cleanerLastName: "Lopez",
          pfpUrl: "https://example.com/cleaners/maria.jpg",
        },
      ],
      totalPrice: 2500,
    },
    {
      id: "bk_002",
      base: {
        id: "bk_002",
        custId: "cust_002",
        customerFirstName: "Pedro",
        customerLastName: "Santos",
        address: {
          addressHuman: "45 Katipunan Ave, Quezon City, NCR",
          addressLat: 14.639722,
          addressLng: 121.074722,
        },
        startSched: "2026-02-07T14:00:00Z",
        endSched: "2026-02-07T16:00:00Z",
        dirtyScale: 4,
        paymentStatus: "UNPAID",
        reviewStatus: "NOT_REQUESTED",
        photos: [],
        createdAt: "2026-02-02T11:00:00Z",
        updatedAt: null,
        quoteId: "q_002",
      },
      mainService: {
        id: "svc_002",
        serviceType: "COUCH",
        details: {
          cleaningSpecs: [
            {
              couchType: "L-SHAPED",
              widthCm: 230,
              depthCm: 90,
              heightCm: 90,
              quantity: 1,
            },
          ],
          bedPillows: 4,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_003",
          name: "Steam Cleaner",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/steam-cleaner.jpg",
        },
      ],
      resources: [
        {
          id: "res_002",
          name: "Upholstery Shampoo",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/upholstery-shampoo.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_002",
          cleanerFirstName: "Jose",
          cleanerLastName: "Reyes",
          pfpUrl: "https://example.com/cleaners/jose.jpg",
        },
        {
          id: "cln_003",
          cleanerFirstName: "Ana",
          cleanerLastName: "Garcia",
          pfpUrl: "https://example.com/cleaners/ana.jpg",
        },
      ],
      totalPrice: 1800,
    },
    {
      id: "bk_003",
      base: {
        id: "bk_003",
        custId: "cust_003",
        customerFirstName: "Luisa",
        customerLastName: "Cruz",
        address: {
          addressHuman: "10 Cebu St, BGC, Taguig, NCR",
          addressLat: 14.549072,
          addressLng: 121.046958,
        },
        startSched: "2026-02-08T08:00:00Z",
        endSched: "2026-02-08T11:00:00Z",
        dirtyScale: 5,
        paymentStatus: "PAID",
        reviewStatus: "COMPLETED",
        photos: ["https://example.com/photos/bk_003_1.jpg"],
        createdAt: "2026-02-03T09:45:00Z",
        updatedAt: "2026-02-04T13:20:00Z",
        quoteId: "q_003",
      },
      mainService: {
        id: "svc_003",
        serviceType: "POST",
        details: {
          sqm: 120,
        },
      },
      addons: [
        {
          id: "addon_002",
          serviceDetail: {
            id: "svc_003_addon_1",
            serviceType: "MATTRESS",
            details: {
              cleaningSpecs: [
                {
                  bedType: "QUEEN",
                  widthCm: 160,
                  depthCm: 200,
                  heightCm: 25,
                  quantity: 2,
                },
              ],
            },
          },
          price: 1500,
        },
      ],
      equipments: [
        {
          id: "eq_004",
          name: "Industrial Vacuum",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/industrial-vacuum.jpg",
        },
      ],
      resources: [
        {
          id: "res_003",
          name: "Heavy-duty Degreaser",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/degreaser.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_004",
          cleanerFirstName: "Mark",
          cleanerLastName: "Tan",
          pfpUrl: "https://example.com/cleaners/mark.jpg",
        },
      ],
      totalPrice: 4200,
    },
    {
      id: "bk_004",
      base: {
        id: "bk_004",
        custId: "cust_004",
        customerFirstName: "Carlo",
        customerLastName: "Ramos",
        address: {
          addressHuman: "88 Taft Ave, Manila, NCR",
          addressLat: 14.586,
          addressLng: 120.983,
        },
        startSched: "2026-02-09T09:30:00Z",
        endSched: "2026-02-09T11:30:00Z",
        dirtyScale: 2,
        paymentStatus: "PAID",
        reviewStatus: "PENDING",
        photos: [],
        createdAt: "2026-02-04T07:30:00Z",
        updatedAt: null,
        quoteId: "q_004",
      },
      mainService: {
        id: "svc_004",
        serviceType: "GENERAL_CLEANING",
        details: {
          homeType: "APARTMENT",
          sqm: 35,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_005",
          name: "Broom",
          type: "MANUAL",
          photoUrl: "https://example.com/equipment/broom.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_005",
          cleanerFirstName: "Irene",
          cleanerLastName: "Villanueva",
          pfpUrl: "https://example.com/cleaners/irene.jpg",
        },
      ],
      totalPrice: 1300,
    },
    {
      id: "bk_005",
      base: {
        id: "bk_005",
        custId: "cust_005",
        customerFirstName: "Miguel",
        customerLastName: "Torres",
        address: {
          addressHuman: "5 Ortigas Ave, Pasig, NCR",
          addressLat: 14.5896,
          addressLng: 121.067,
        },
        startSched: "2026-02-10T13:00:00Z",
        endSched: "2026-02-10T15:30:00Z",
        dirtyScale: 3,
        paymentStatus: "UNPAID",
        reviewStatus: "NOT_REQUESTED",
        photos: [],
        createdAt: "2026-02-04T10:00:00Z",
        updatedAt: null,
        quoteId: "q_005",
      },
      mainService: {
        id: "svc_005",
        serviceType: "COUCH",
        details: {
          cleaningSpecs: [
            {
              couchType: "3-SEATER",
              widthCm: 200,
              depthCm: 85,
              heightCm: 95,
              quantity: 1,
            },
          ],
          bedPillows: 2,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_006",
          name: "Fabric Brush",
          type: "MANUAL",
          photoUrl: "https://example.com/equipment/fabric-brush.jpg",
        },
      ],
      resources: [
        {
          id: "res_004",
          name: "Fabric Cleaner",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/fabric-cleaner.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_006",
          cleanerFirstName: "Paolo",
          cleanerLastName: "Mendoza",
          pfpUrl: "https://example.com/cleaners/paolo.jpg",
        },
      ],
      totalPrice: 1600,
    },
    {
      id: "bk_006",
      base: {
        id: "bk_006",
        custId: "cust_006",
        customerFirstName: "Rina",
        customerLastName: "Ocampo",
        address: {
          addressHuman: "21 Shaw Blvd, Mandaluyong, NCR",
          addressLat: 14.579,
          addressLng: 121.046,
        },
        startSched: "2026-02-11T07:30:00Z",
        endSched: "2026-02-11T10:00:00Z",
        dirtyScale: 4,
        paymentStatus: "PAID",
        reviewStatus: "COMPLETED",
        photos: ["https://example.com/photos/bk_006_1.jpg"],
        createdAt: "2026-02-05T05:45:00Z",
        updatedAt: "2026-02-05T09:15:00Z",
        quoteId: "q_006",
      },
      mainService: {
        id: "svc_006",
        serviceType: "MATTRESS",
        details: {
          cleaningSpecs: [
            {
              bedType: "DOUBLE",
              widthCm: 140,
              depthCm: 190,
              heightCm: 20,
              quantity: 1,
            },
          ],
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_007",
          name: "Handheld Vacuum",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/handheld-vacuum.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_007",
          cleanerFirstName: "Sofia",
          cleanerLastName: "Lim",
          pfpUrl: "https://example.com/cleaners/sofia.jpg",
        },
      ],
      totalPrice: 1900,
    },
    {
      id: "bk_007",
      base: {
        id: "bk_007",
        custId: "cust_007",
        customerFirstName: "Allan",
        customerLastName: "Go",
        address: {
          addressHuman: "16 Macapagal Blvd, Pasay, NCR",
          addressLat: 14.537,
          addressLng: 120.983,
        },
        startSched: "2026-02-11T15:00:00Z",
        endSched: "2026-02-11T17:00:00Z",
        dirtyScale: 1,
        paymentStatus: "PAID",
        reviewStatus: "PENDING",
        photos: [],
        createdAt: "2026-02-05T06:30:00Z",
        updatedAt: null,
        quoteId: "q_007",
      },
      mainService: {
        id: "svc_007",
        serviceType: "CAR",
        details: {
          cleaningSpecs: [
            {
              carType: "SEDAN",
              quantity: 1,
            },
          ],
          childSeats: 1,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_008",
          name: "Pressure Washer",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/pressure-washer.jpg",
        },
      ],
      resources: [
        {
          id: "res_005",
          name: "Car Shampoo",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/car-shampoo.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_008",
          cleanerFirstName: "Leo",
          cleanerLastName: "Ng",
          pfpUrl: "https://example.com/cleaners/leo.jpg",
        },
      ],
      totalPrice: 1100,
    },
    {
      id: "bk_008",
      base: {
        id: "bk_008",
        custId: "cust_008",
        customerFirstName: "Grace",
        customerLastName: "Uy",
        address: {
          addressHuman: "3 Pioneer St, Mandaluyong, NCR",
          addressLat: 14.571,
          addressLng: 121.051,
        },
        startSched: "2026-02-12T09:00:00Z",
        endSched: "2026-02-12T12:00:00Z",
        dirtyScale: 5,
        paymentStatus: "UNPAID",
        reviewStatus: "NOT_REQUESTED",
        photos: [],
        createdAt: "2026-02-05T08:20:00Z",
        updatedAt: null,
        quoteId: "q_008",
      },
      mainService: {
        id: "svc_008",
        serviceType: "POST",
        details: {
          sqm: 200,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_009",
          name: "Scrubber",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/scrubber.jpg",
        },
      ],
      resources: [
        {
          id: "res_006",
          name: "Floor Stripper",
          type: "CHEMICAL",
          photoUrl: "https://example.com/resources/floor-stripper.jpg",
        },
      ],
      cleaners: [
        {
          id: "cln_009",
          cleanerFirstName: "Cathy",
          cleanerLastName: "Zhang",
          pfpUrl: "https://example.com/cleaners/cathy.jpg",
        },
        {
          id: "cln_010",
          cleanerFirstName: "Noel",
          cleanerLastName: "Sy",
          pfpUrl: "https://example.com/cleaners/noel.jpg",
        },
      ],
      totalPrice: 5000,
    },
    {
      id: "bk_009",
      base: {
        id: "bk_009",
        custId: "cust_009",
        customerFirstName: "Hanna",
        customerLastName: "Flores",
        address: {
          addressHuman: "12 Roosevelt Ave, Quezon City, NCR",
          addressLat: 14.657,
          addressLng: 121.031,
        },
        startSched: "2026-02-13T10:00:00Z",
        endSched: "2026-02-13T12:30:00Z",
        dirtyScale: 2,
        paymentStatus: "PAID",
        reviewStatus: "PENDING",
        photos: [],
        createdAt: "2026-02-05T09:10:00Z",
        updatedAt: null,
        quoteId: "q_009",
      },
      mainService: {
        id: "svc_009",
        serviceType: "GENERAL_CLEANING",
        details: {
          homeType: "HOUSE",
          sqm: 70,
        },
      },
      addons: [
        {
          id: "addon_003",
          serviceDetail: {
            id: "svc_009_addon_1",
            serviceType: "CAR",
            details: {
              cleaningSpecs: [
                {
                  carType: "SUV",
                  quantity: 1,
                },
              ],
              childSeats: 2,
            },
          },
          price: 900,
        },
      ],
      equipments: [
        {
          id: "eq_010",
          name: "Bucket",
          type: "MANUAL",
          photoUrl: "https://example.com/equipment/bucket.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_011",
          cleanerFirstName: "Henry",
          cleanerLastName: "Chua",
          pfpUrl: "https://example.com/cleaners/henry.jpg",
        },
      ],
      totalPrice: 2700,
    },
    {
      id: "bk_010",
      base: {
        id: "bk_010",
        custId: "cust_010",
        customerFirstName: "Bea",
        customerLastName: "Navarro",
        address: {
          addressHuman: "30 Jupiter St, Makati, NCR",
          addressLat: 14.562,
          addressLng: 121.031,
        },
        startSched: "2026-02-13T15:00:00Z",
        endSched: "2026-02-13T17:30:00Z",
        dirtyScale: 3,
        paymentStatus: "UNPAID",
        reviewStatus: "NOT_REQUESTED",
        photos: [],
        createdAt: "2026-02-05T10:00:00Z",
        updatedAt: null,
        quoteId: "q_010",
      },
      mainService: {
        id: "svc_010",
        serviceType: "COUCH",
        details: {
          cleaningSpecs: [
            {
              couchType: "SECTIONAL",
              widthCm: 250,
              depthCm: 100,
              heightCm: 95,
              quantity: 1,
            },
          ],
          bedPillows: 6,
        },
      },
      addons: [],
      equipments: [],
      resources: [],
      cleaners: [
        {
          id: "cln_012",
          cleanerFirstName: "Diane",
          cleanerLastName: "Quintos",
          pfpUrl: "https://example.com/cleaners/diane.jpg",
        },
      ],
      totalPrice: 2100,
    },
    {
      id: "bk_011",
      base: {
        id: "bk_011",
        custId: "cust_011",
        customerFirstName: "Jasper",
        customerLastName: "Uy",
        address: {
          addressHuman: "7 Sucat Rd, Paranaque, NCR",
          addressLat: 14.486,
          addressLng: 121.038,
        },
        startSched: "2026-02-14T08:00:00Z",
        endSched: "2026-02-14T10:00:00Z",
        dirtyScale: 4,
        paymentStatus: "PAID",
        reviewStatus: "PENDING",
        photos: [],
        createdAt: "2026-02-05T11:15:00Z",
        updatedAt: null,
        quoteId: "q_011",
      },
      mainService: {
        id: "svc_011",
        serviceType: "MATTRESS",
        details: {
          cleaningSpecs: [
            {
              bedType: "KING",
              widthCm: 180,
              depthCm: 200,
              heightCm: 30,
              quantity: 1,
            },
            {
              bedType: "SINGLE",
              widthCm: 90,
              depthCm: 190,
              heightCm: 20,
              quantity: 1,
            },
          ],
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_011",
          name: "UV Sanitizer",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/uv-sanitizer.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_013",
          cleanerFirstName: "Fiona",
          cleanerLastName: "Laurel",
          pfpUrl: "https://example.com/cleaners/fiona.jpg",
        },
      ],
      totalPrice: 3200,
    },
    {
      id: "bk_012",
      base: {
        id: "bk_012",
        custId: "cust_012",
        customerFirstName: "Nina",
        customerLastName: "Gomez",
        address: {
          addressHuman: "15 Commonwealth Ave, Quezon City, NCR",
          addressLat: 14.676,
          addressLng: 121.043,
        },
        startSched: "2026-02-14T13:30:00Z",
        endSched: "2026-02-14T16:00:00Z",
        dirtyScale: 5,
        paymentStatus: "UNPAID",
        reviewStatus: "NOT_REQUESTED",
        photos: [],
        createdAt: "2026-02-05T12:00:00Z",
        updatedAt: null,
        quoteId: "q_012",
      },
      mainService: {
        id: "svc_012",
        serviceType: "POST",
        details: {
          sqm: 150,
        },
      },
      addons: [
        {
          id: "addon_004",
          serviceDetail: {
            id: "svc_012_addon_1",
            serviceType: "GENERAL_CLEANING",
            details: {
              homeType: "HOUSE",
              sqm: 30,
            },
          },
          price: 1200,
        },
      ],
      equipments: [
        {
          id: "eq_012",
          name: "Floor Polisher",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/floor-polisher.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_014",
          cleanerFirstName: "Owen",
          cleanerLastName: "Santos",
          pfpUrl: "https://example.com/cleaners/owen.jpg",
        },
      ],
      totalPrice: 5600,
    },
    {
      id: "bk_013",
      base: {
        id: "bk_013",
        custId: "cust_013",
        customerFirstName: "Trina",
        customerLastName: "Yu",
        address: {
          addressHuman: "9 EDSA, Caloocan, NCR",
          addressLat: 14.653,
          addressLng: 120.983,
        },
        startSched: "2026-02-15T09:00:00Z",
        endSched: "2026-02-15T11:30:00Z",
        dirtyScale: 2,
        paymentStatus: "PAID",
        reviewStatus: "COMPLETED",
        photos: ["https://example.com/photos/bk_013_1.jpg"],
        createdAt: "2026-02-05T12:30:00Z",
        updatedAt: "2026-02-05T15:00:00Z",
        quoteId: "q_013",
      },
      mainService: {
        id: "svc_013",
        serviceType: "CAR",
        details: {
          cleaningSpecs: [
            {
              carType: "HATCHBACK",
              quantity: 1,
            },
          ],
          childSeats: 0,
        },
      },
      addons: [],
      equipments: [
        {
          id: "eq_013",
          name: "Foam Cannon",
          type: "ELECTRIC",
          photoUrl: "https://example.com/equipment/foam-cannon.jpg",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "cln_015",
          cleanerFirstName: "Gail",
          cleanerLastName: "Robles",
          pfpUrl: "https://example.com/cleaners/gail.jpg",
        },
      ],
      totalPrice: 1400,
    },
  ],
};
