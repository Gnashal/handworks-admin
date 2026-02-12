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
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
          "https://images.unsplash.com/photo-1581578731341-046aed8d1c86",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
        {
          id: "eq_002",
          name: "Mop",
          type: "MANUAL",
          photoUrl:
            "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        },
      ],
      resources: [
        {
          id: "res_001",
          name: "All-purpose Cleaner",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_001",
          cleanerFirstName: "Maria",
          cleanerLastName: "Lopez",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-02T11:00:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1621609871049-d8b7430c2c66",
        },
      ],
      resources: [
        {
          id: "res_002",
          name: "Upholstery Shampoo",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_002",
          cleanerFirstName: "Jose",
          cleanerLastName: "Reyes",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        },
        {
          id: "emp_003",
          cleanerFirstName: "Ana",
          cleanerLastName: "Garcia",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        photos: [
          "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        ],
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
      ],
      resources: [
        {
          id: "res_003",
          name: "Heavy-duty Degreaser",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_004",
          cleanerFirstName: "Mark",
          cleanerLastName: "Tan",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_005",
          cleanerFirstName: "Irene",
          cleanerLastName: "Villanueva",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        },
      ],
      resources: [
        {
          id: "res_004",
          name: "Fabric Cleaner",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_006",
          cleanerFirstName: "Paolo",
          cleanerLastName: "Mendoza",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        photos: [
          "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        ],
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_007",
          cleanerFirstName: "Sofia",
          cleanerLastName: "Lim",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1508896694512-1eade5586795",
        },
      ],
      resources: [
        {
          id: "res_005",
          name: "Car Shampoo",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_008",
          cleanerFirstName: "Leo",
          cleanerLastName: "Ng",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
      ],
      resources: [
        {
          id: "res_006",
          name: "Floor Stripper",
          type: "CHEMICAL",
          photoUrl:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26fb",
        },
      ],
      cleaners: [
        {
          id: "emp_009",
          cleanerFirstName: "Cathy",
          cleanerLastName: "Zhang",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        },
        {
          id: "emp_010",
          cleanerFirstName: "Noel",
          cleanerLastName: "Sy",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581579188842-246c3b41f852",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_011",
          cleanerFirstName: "Henry",
          cleanerLastName: "Chua",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          id: "emp_012",
          cleanerFirstName: "Diane",
          cleanerLastName: "Quintos",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_013",
          cleanerFirstName: "Fiona",
          cleanerLastName: "Laurel",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        updatedAt: "2026-02-04T07:30:00Z",
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
          photoUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_014",
          cleanerFirstName: "Owen",
          cleanerLastName: "Santos",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
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
        photos: [
          "https://images.unsplash.com/photo-1508896694512-1eade5586795",
        ],
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
          photoUrl:
            "https://images.unsplash.com/photo-1508896694512-1eade5586795",
        },
      ],
      resources: [],
      cleaners: [
        {
          id: "emp_015",
          cleanerFirstName: "Gail",
          cleanerLastName: "Robles",
          pfpUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        },
      ],
      totalPrice: 1400,
    },
  ],
};
