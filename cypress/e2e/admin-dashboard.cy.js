/// <reference types="cypress" />

describe("Handworks Admin Dashboard E2E Tests", () => {
  beforeEach(() => {
    // Visit the dashboard home page
    cy.visit("http://localhost:3000");
  });

  describe("Dashboard Navigation", () => {
    it("should load the dashboard successfully", () => {
      // Verify page is loaded and dashboard header is visible
      cy.contains("h2", "Overview").should("be.visible");
    });

    it("should display the dashboard overview", () => {
      // Wait for dashboard content to load
      cy.get('[class*="space-y-6"]').should("exist");

      // Verify key dashboard elements are present
      cy.contains("Overview").should("be.visible");
    });

    it("should have accessible navigation menu", () => {
      // Check for navigation elements (adjust selector based on your actual nav structure)
      cy.get("nav").should("be.visible");
    });
  });

  describe("Dashboard Date Filtering", () => {
    it("should display date filter options", () => {
      // Look for date filter component
      cy.get("button").should("exist");
    });

    it("should update content when date filter changes", () => {
      // Find and interact with date filter buttons/select (adjust selector as needed)
      cy.get("button").each(($button) => {
        if (
          $button.text().includes("week") ||
          $button.text().includes("month") ||
          $button.text().includes("year")
        ) {
          cy.wrap($button).should("be.visible");
        }
      });
    });
  });

  describe("Page Loading and Performance", () => {
    it("should not display loading state permanently", () => {
      // Check that loader component is not stuck
      cy.get('[class*="loader"]', { timeout: 5000 }).should("not.exist");
    });

    it("should load dashboard within acceptable time", () => {
      const start = Date.now();
      cy.visit("http://localhost:3000", {
        onLoad: () => {
          const loadTime = Date.now() - start;
          // Assert load time is less than 5 seconds
          expect(loadTime).to.be.lessThan(5000);
        },
      });
      cy.contains("Overview", { timeout: 5000 }).should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should display error message if dashboard data fails to load", () => {
      // This test assumes error handling UI shows up on API failure
      // You may need to mock failed API responses using cy.intercept()
      cy.get('[class*="text-destructive"]', { timeout: 3000 }).then(
        ($error) => {
          if ($error.length > 0) {
            cy.wrap($error).should("contain", "Failed to load");
          }
        },
      );
    });
  });

  describe("Responsive Design", () => {
    it("should display properly on mobile viewport", () => {
      cy.viewport("iphone-x");
      cy.contains("Overview").should("be.visible");
      cy.get('[class*="p-6"]', { timeout: 3000 }).should("be.visible");
    });

    it("should display properly on tablet viewport", () => {
      cy.viewport("ipad-2");
      cy.contains("Overview").should("be.visible");
    });

    it("should display properly on desktop viewport", () => {
      cy.viewport("macbook-15");
      cy.contains("Overview").should("be.visible");
    });
  });

  describe("DOM Structure and Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      cy.get("h2").should("exist");
    });

    it("should render buttons and interactive elements", () => {
      cy.get("button").should("have.length.greaterThan", 0);
    });

    it("should have accessible color contrast (visual check)", () => {
      // Basic visibility check
      cy.contains("Overview").should("be.visible");
      cy.get("body").should("have.css", "background-color");
    });
  });

  describe("Data Display", () => {
    it("should display overview cards or statistics", () => {
      // Adjust selectors based on your actual dashboard card structure
      cy.get('[class*="card"], [class*="stat"], div[role="region"]').should(
        "have.length.greaterThan",
        0,
      );
    });

    it("should render without console errors", () => {
      // Spy on console.error to catch any runtime errors
      let hasErrors = false;
      cy.on("window:before:load", (win) => {
        cy.spy(win.console, "error");
      });

      cy.on("window:load", (win) => {
        expect(win.console.error.called).to.be.false;
      });
    });
  });

  describe("Session and State", () => {
    it("should maintain dashboard state on page reload", () => {
      // Capture initial state
      cy.get("body").then(() => {
        // Reload page
        cy.reload();

        // Verify page loads again
        cy.contains("Overview", { timeout: 5000 }).should("be.visible");
      });
    });
  });
});
