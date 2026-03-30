// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.open-vet-format.vetnote.app",
  integrations: [
    starlight({
      title: "Open Vet Format",
      description:
        "FHIR-inspired JSON Schema for veterinary medical record exchange",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/vetformat/ovf",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/vetformat/ovf/edit/main/docs-site/",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Quick Start", slug: "getting-started/quick-start" },
            { label: "Installation", slug: "getting-started/installation" },
          ],
        },
        {
          label: "Schemas",
          items: [
            { label: "Overview", slug: "schemas/overview" },
            { label: "OVF Document", slug: "schemas/ovf" },
            { label: "Patient", slug: "schemas/patient" },
            { label: "Encounter", slug: "schemas/encounter" },
            { label: "Condition", slug: "schemas/condition" },
            { label: "Observation", slug: "schemas/observation" },
            { label: "Immunization", slug: "schemas/immunization" },
            { label: "Procedure", slug: "schemas/procedure" },
            { label: "AllergyIntolerance", slug: "schemas/allergy-intolerance" },
            { label: "MedicationStatement", slug: "schemas/medication-statement" },
            { label: "DocumentReference", slug: "schemas/document-reference" },
          ],
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
        {
          label: "Guides",
          items: [
            { label: "FHIR Mapping", slug: "guides/fhir-mapping" },
            { label: "Polish Extensions", slug: "guides/polish-extensions" },
            { label: "Extensions (x_ prefix)", slug: "guides/extensions" },
          ],
        },
        {
          label: "Specification",
          items: [
            { label: "Formal Spec", slug: "specification/formal" },
            { label: "Versioning", slug: "specification/versioning" },
            { label: "Conformance", slug: "specification/conformance" },
          ],
        },
      ],
    }),
  ],
});
