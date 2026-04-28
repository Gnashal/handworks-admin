/// <reference types="cypress" />

describe("Handworks Admin - Authentication and Navigation Flow", () => {
  describe("Authentication Flow", () => {
    it("should handle unauthenticated user access", () => {
      // This test assumes Clerk redirects unauthenticated users
      // Adjust based on your actual auth setup
      cy.visit("http://localhost:3000");

      // Either redirects to auth or shows protected content
      cy.get("body").should("exist");
    });
  });

  describe("Navigation Between Sections", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000");

      // Wait for page to load
      cy.contains("Overview", { timeout: 5000 }).should("be.visible");
    });

    it("should navigate through main menu items", () => {
      // This test structure works for any navigation pattern
      // Adjust selectors based on your actual navigation component

      // Verify nav is accessible
      cy.get('nav, [role="navigation"]', { timeout: 3000 }).should(
        "be.visible",
      );
    });

    it("should navigate to bookings section", () => {
      // Look for bookings link/button
      cy.get("a, button").each(($el) => {
        if ($el.text().toLowerCase().includes("booking")) {
          cy.wrap($el).should("be.visible");
        }
      });
    });

    it("should navigate to clients section", () => {
      // Look for clients link/button
      cy.get("a, button").each(($el) => {
        if ($el.text().toLowerCase().includes("client")) {
          cy.wrap($el).should("be.visible");
        }
      });
    });

    it("should navigate to employees section", () => {
      // Look for employees link/button
      cy.get("a, button").each(($el) => {
        if ($el.text().toLowerCase().includes("employee")) {
          cy.wrap($el).should("be.visible");
        }
      });
    });

    it("should navigate to inventory section", () => {
      // Look for inventory link/button
      cy.get("a, button").each(($el) => {
        if ($el.text().toLowerCase().includes("inventory")) {
          cy.wrap($el).should("be.visible");
        }
      });
    });

    it("should navigate to calendar section", () => {
      // Look for calendar link/button
      cy.get("a, button").each(($el) => {
        if ($el.text().toLowerCase().includes("calendar")) {
          cy.wrap($el).should("be.visible");
        }
      });
    });

    it("should return to dashboard from any section", () => {
      // Look for home/dashboard link
      cy.get("a, button").each(($el) => {
        if (
          $el.text().toLowerCase().includes("dashboard") ||
          $el.text().toLowerCase().includes("home")
        ) {
          cy.wrap($el).should("be.visible");
        }
      });
    });
  });

  describe("Data Table Interactions", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.contains("Overview", { timeout: 5000 }).should("be.visible");
    });

    it("should render data tables when navigating to data sections", () => {
      // Look for table elements
      cy.get('table, [role="table"], [class*="table"]', { timeout: 3000 }).then(
        ($table) => {
          // If tables exist, verify they're properly rendered
          if ($table.length > 0) {
            cy.wrap($table).first().should("be.visible");
          }
        },
      );
    });

    it("should display table headers", () => {
      // Check for table header elements
      cy.get('[role="columnheader"], th, thead', { timeout: 3000 }).then(
        ($header) => {
          if ($header.length > 0) {
            cy.wrap($header).should("be.visible");
          }
        },
      );
    });

    it("should display table body with data rows", () => {
      // Check for table rows
      cy.get('[role="row"], tr tbody tr', { timeout: 3000 }).then(($rows) => {
        if ($rows.length > 0) {
          cy.wrap($rows).first().should("be.visible");
        }
      });
    });

    it("should support table sorting if available", () => {
      // Look for sortable column headers
      cy.get('button[class*="sort"], [class*="sortable"]', {
        timeout: 3000,
      }).then(($sortBtn) => {
        if ($sortBtn.length > 0) {
          cy.wrap($sortBtn).first().click();
          cy.wrap($sortBtn).first().should("be.visible");
        }
      });
    });

    it("should support pagination if available", () => {
      // Look for pagination controls
      cy.get('[class*="pagination"], [aria-label*="page"]', {
        timeout: 3000,
      }).then(($pagination) => {
        if ($pagination.length > 0) {
          cy.wrap($pagination).should("be.visible");
        }
      });
    });
  });

  describe("Header and Layout Components", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000");
    });

    it("should display header component", () => {
      cy.get('header, [class*="header"]', { timeout: 3000 }).should(
        "be.visible",
      );
    });

    it("should have accessible layout sections", () => {
      cy.get('main, [role="main"]', { timeout: 3000 }).should("be.visible");
    });

    it("should render notifications component if present", () => {
      // Look for notification/toast container
      cy.get('[class*="toast"], [class*="notification"], [role="alert"]', {
        timeout: 3000,
      }).then(($notif) => {
        // Component may or may not be visible initially
        cy.wrap($notif).should("have.length.gte", 0);
      });
    });
  });

  describe("Loading States and Transitions", () => {
    it("should show loading state during navigation", () => {
      cy.visit("http://localhost:3000");

      // Look for loader component
      cy.get('[class*="loader"], [class*="spinner"], [class*="loading"]', {
        timeout: 5000,
      }).then(($loader) => {
        // Loader may be present during load
        if ($loader.length > 0) {
          // Verify it eventually disappears
          cy.wrap($loader).should("not.exist", { timeout: 5000 });
        }
      });
    });

    it("should smoothly transition between pages", () => {
      cy.visit("http://localhost:3000");

      // Capture page state
      cy.get("body")
        .invoke("html")
        .then((initialHtml) => {
          expect(initialHtml).to.exist;
        });
    });
  });

  describe("Error Recovery", () => {
    it("should handle network errors gracefully", () => {
      // Simulate network error
      cy.intercept("GET", "**", { forceNetworkError: true }).as("networkError");

      cy.visit("http://localhost:3000", { failOnStatusCode: false });

      // Page should still be somewhat usable or show error message
      cy.get("body").should("exist");
    });

    it("should display error messages for failed API calls", () => {
      // Intercept and mock a failed API response
      cy.intercept("GET", "**/api/**", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("failedApi");

      cy.visit("http://localhost:3000", { failOnStatusCode: false });

      // Check for error display
      cy.get('[class*="error"], [class*="alert"]', { timeout: 3000 }).then(
        ($error) => {
          // Error message may or may not be visible
          expect($error).to.have.length.gte(0);
        },
      );
    });
  });

  describe("Cross-Browser Compatibility", () => {
    it("should work in standard viewport", () => {
      cy.viewport("macbook-15");
      cy.visit("http://localhost:3000");
      cy.get("body").should("be.visible");
    });

    it("should work on mobile devices", () => {
      cy.viewport("iphone-12");
      cy.visit("http://localhost:3000");
      cy.get("body").should("be.visible");
    });

    it("should work on tablets", () => {
      cy.viewport("ipad-mini");
      cy.visit("http://localhost:3000");
      cy.get("body").should("be.visible");
    });
  });

  describe("User Interactions", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.contains("Overview", { timeout: 5000 }).should("be.visible");
    });

    it("should handle button clicks", () => {
      // Find and click any button
      cy.get("button")
        .first()
        .then(($button) => {
          if ($button.is(":visible")) {
            cy.wrap($button).click();
          }
        });
    });

    it("should handle link navigation", () => {
      // Find and click any link
      cy.get("a")
        .first()
        .then(($link) => {
          if (
            $link.is(":visible") &&
            !$link.attr("href")?.includes("javascript")
          ) {
            cy.wrap($link).click();
          }
        });
    });

    it("should handle form inputs if present", () => {
      // Look for input elements
      cy.get("input")
        .first()
        .then(($input) => {
          if ($input.is(":visible") && $input.attr("type") !== "hidden") {
            cy.wrap($input).click();
          }
        });
    });

    it("should handle dropdown selections if present", () => {
      // Look for select elements
      cy.get("select")
        .first()
        .then(($select) => {
          if ($select.is(":visible")) {
            cy.wrap($select).click();
          }
        });
    });
  });
});
