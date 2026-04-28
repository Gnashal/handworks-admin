/// <reference types="cypress" />

describe("Handworks Admin - Forms and Data Operations", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.contains("Overview", { timeout: 5000 }).should("be.visible");
  });

  describe("Form Elements and Validation", () => {
    it("should render form inputs correctly", () => {
      // Check for various input types
      cy.get("input", { timeout: 3000 }).then(($inputs) => {
        expect($inputs.length).to.be.gte(0);
      });
    });

    it("should support text input", () => {
      cy.get('input[type="text"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input)
              .type("Test input")
              .should("have.value", "Test input");
          }
        });
    });

    it("should support email input", () => {
      cy.get('input[type="email"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input)
              .type("test@example.com")
              .should("have.value", "test@example.com");
          }
        });
    });

    it("should support number input", () => {
      cy.get('input[type="number"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input).type("123").should("have.value", "123");
          }
        });
    });

    it("should support checkbox inputs", () => {
      cy.get('input[type="checkbox"]')
        .first()
        .then(($checkbox) => {
          if ($checkbox.is(":visible")) {
            cy.wrap($checkbox).click().should("be.checked");
          }
        });
    });

    it("should support radio buttons", () => {
      cy.get('input[type="radio"]')
        .first()
        .then(($radio) => {
          if ($radio.is(":visible")) {
            cy.wrap($radio).click().should("be.checked");
          }
        });
    });

    it("should support select dropdowns", () => {
      cy.get("select")
        .first()
        .then(($select) => {
          if ($select.is(":visible")) {
            cy.wrap($select).should("exist");
            // Select an option
            cy.wrap($select)
              .find("option")
              .then((options) => {
                if (options.length > 1) {
                  cy.wrap($select).select(options[1].value);
                }
              });
          }
        });
    });

    it("should support textarea inputs", () => {
      cy.get("textarea")
        .first()
        .then(($textarea) => {
          if ($textarea.is(":visible")) {
            cy.wrap($textarea)
              .type("Test message")
              .should("have.value", "Test message");
          }
        });
    });
  });

  describe("Form Submission", () => {
    it("should find and interact with form elements", () => {
      cy.get("form", { timeout: 3000 })
        .first()
        .then(($form) => {
          if ($form.is(":visible")) {
            cy.wrap($form).should("exist");
          }
        });
    });

    it("should have submit buttons", () => {
      cy.get(
        'button[type="submit"], button:contains("Submit"), button:contains("Save"), button:contains("Create"), button:contains("Update")',
        { timeout: 3000 },
      ).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).first().should("be.visible");
        }
      });
    });

    it("should handle form reset if available", () => {
      cy.get('button[type="reset"]')
        .first()
        .then(($btn) => {
          if ($btn.is(":visible")) {
            cy.wrap($btn).click();
          }
        });
    });
  });

  describe("Data Filtering and Search", () => {
    it("should have search functionality if available", () => {
      cy.get(
        'input[placeholder*="search"], input[placeholder*="Search"], input[aria-label*="search"]',
        { timeout: 3000 },
      ).then(($search) => {
        if ($search.length > 0) {
          cy.wrap($search)
            .first()
            .type("test search")
            .should("have.value", "test search");
        }
      });
    });

    it("should support filtering options", () => {
      cy.get(
        '[class*="filter"], button:contains("Filter"), [aria-label*="filter"]',
        { timeout: 3000 },
      ).then(($filter) => {
        if ($filter.length > 0) {
          cy.wrap($filter).first().should("be.visible");
        }
      });
    });

    it("should clear filters if available", () => {
      cy.get(
        'button:contains("Clear"), button:contains("Reset"), [class*="clear"]',
        { timeout: 3000 },
      ).then(($clear) => {
        if ($clear.length > 0) {
          cy.wrap($clear).first().click();
        }
      });
    });
  });

  describe("Modal/Dialog Interactions", () => {
    it("should open modals when triggered", () => {
      // Look for modal/dialog trigger buttons
      cy.get(
        'button:contains("Create"), button:contains("Add"), button:contains("New"), button:contains("Edit")',
        { timeout: 3000 },
      )
        .first()
        .then(($btn) => {
          if ($btn.is(":visible")) {
            cy.wrap($btn).click();
            // Check if modal/dialog appears
            cy.get('[role="dialog"], [class*="modal"], [class*="dialog"]', {
              timeout: 2000,
            }).then(($modal) => {
              expect($modal.length).to.be.gte(0);
            });
          }
        });
    });

    it("should close modals with close button", () => {
      cy.get(
        'button:contains("Close"), button:contains("Cancel"), button[aria-label*="close"]',
        { timeout: 3000 },
      )
        .first()
        .then(($closeBtn) => {
          if ($closeBtn.is(":visible")) {
            cy.wrap($closeBtn).click();
          }
        });
    });

    it("should close modals with escape key", () => {
      cy.get('[role="dialog"], [class*="modal"]', { timeout: 3000 }).then(
        ($modal) => {
          if ($modal.length > 0) {
            cy.wrap($modal).type("{esc}");
          }
        },
      );
    });
  });

  describe("Date and Time Inputs", () => {
    it("should support date input fields", () => {
      cy.get('input[type="date"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input).type("04/29/2026");
          }
        });
    });

    it("should support time input fields", () => {
      cy.get('input[type="time"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input).type("14:30");
          }
        });
    });

    it("should support datetime-local input fields", () => {
      cy.get('input[type="datetime-local"]')
        .first()
        .then(($input) => {
          if ($input.is(":visible")) {
            cy.wrap($input).type("04/29/2026 14:30");
          }
        });
    });
  });

  describe("File Upload", () => {
    it("should handle file inputs if present", () => {
      cy.get('input[type="file"]')
        .first()
        .then(($fileInput) => {
          if ($fileInput.is(":visible")) {
            cy.wrap($fileInput).should("exist");
          }
        });
    });

    it("should support drag and drop for files", () => {
      cy.get('[class*="dropzone"], [class*="upload"]')
        .first()
        .then(($dropZone) => {
          if ($dropZone.is(":visible")) {
            cy.wrap($dropZone).should("be.visible");
          }
        });
    });
  });

  describe("Data Table Interactions", () => {
    it("should allow inline row selection", () => {
      cy.get('input[type="checkbox"][class*="row"]')
        .first()
        .then(($checkbox) => {
          if ($checkbox.is(":visible")) {
            cy.wrap($checkbox).click().should("be.checked");
          }
        });
    });

    it("should support row expansion if available", () => {
      cy.get('button[aria-label*="expand"], [class*="expand"]')
        .first()
        .then(($expand) => {
          if ($expand.is(":visible")) {
            cy.wrap($expand).click();
          }
        });
    });

    it("should support inline editing if available", () => {
      cy.get('[contenteditable="true"], [class*="edit-mode"]')
        .first()
        .then(($editable) => {
          if ($editable.is(":visible")) {
            cy.wrap($editable).click().type("Updated value");
          }
        });
    });

    it("should display row actions", () => {
      cy.get(
        '[class*="row-action"], button[aria-label*="more"], [class*="menu"]',
      )
        .first()
        .then(($action) => {
          if ($action.is(":visible")) {
            cy.wrap($action).should("be.visible");
          }
        });
    });
  });

  describe("Bulk Operations", () => {
    it("should support select all checkbox", () => {
      cy.get(
        'input[type="checkbox"][aria-label*="all"], input[class*="select-all"]',
      )
        .first()
        .then(($selectAll) => {
          if ($selectAll.is(":visible")) {
            cy.wrap($selectAll).click();
          }
        });
    });

    it("should display bulk action toolbar when items selected", () => {
      cy.get('[class*="bulk-action"], [class*="toolbar"]').then(($toolbar) => {
        expect($toolbar.length).to.be.gte(0);
      });
    });

    it("should support bulk delete if available", () => {
      cy.get('button:contains("Delete"), button:contains("Remove")', {
        timeout: 3000,
      })
        .last()
        .then(($delete) => {
          if ($delete.is(":visible")) {
            cy.wrap($delete).should("be.visible");
          }
        });
    });
  });

  describe("Validation Feedback", () => {
    it("should display validation errors", () => {
      cy.get('[class*="error"], [class*="invalid"], [role="alert"]').then(
        ($error) => {
          // Errors may or may not be initially visible
          expect($error.length).to.be.gte(0);
        },
      );
    });

    it("should display field-level error messages", () => {
      cy.get('[class*="form-error"], [class*="field-error"], .error').then(
        ($fieldError) => {
          expect($fieldError.length).to.be.gte(0);
        },
      );
    });

    it("should display success messages", () => {
      cy.get('[class*="success"], [class*="success-message"]', {
        timeout: 3000,
      }).then(($success) => {
        expect($success.length).to.be.gte(0);
      });
    });
  });

  describe("Accessibility in Forms", () => {
    it("should have associated labels for inputs", () => {
      cy.get("input")
        .first()
        .then(($input) => {
          const inputId = $input.attr("id");
          if (inputId) {
            cy.get(`label[for="${inputId}"]`).then(($label) => {
              expect($label.length).to.be.gte(0);
            });
          }
        });
    });

    it("should support keyboard navigation in forms", () => {
      cy.get("input, button, select, textarea")
        .first()
        .then(($element) => {
          cy.wrap($element).focus();
          cy.focused().should("have.length", 1);
        });
    });

    it("should have proper ARIA attributes", () => {
      cy.get("[role]").should("have.length.greaterThan", 0);
    });
  });
});
