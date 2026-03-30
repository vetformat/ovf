<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Polish Market Extensions

This guide covers Poland-specific identifier systems, breed registries, and conventions supported by Open Vet Format. These features are built into the core schema using the `identifiers` and `breed_code` fields on the Patient resource.

---

## Microchip Standards

### ISO 11784/11785

The international standard for radio frequency identification of animals. All microchips used in Poland comply with this standard.

- **Format**: 15-digit numeric string.
- **Structure**: The first 3 digits encode the country code per ISO 3166 numeric. Poland's country code is **616**.
- **OVF system**: `iso-microchip-11784`

A Polish microchip number always starts with `616`:

```json
{
  "identifiers": [
    {
      "system": "iso-microchip-11784",
      "value": "616000012345678"
    }
  ]
}
```

The 15-digit format breaks down as:

| Digits | Meaning |
|---|---|
| 1-3 | Country code (616 for Poland) |
| 4-5 | Manufacturer code |
| 6-15 | Unique animal identifier |

---

## Pet Registries

### SAFE-ANIMAL

[SAFE-ANIMAL](https://www.safe-animal.eu) is Poland's official pet registry for microchipped animals. It is the primary database used by veterinary clinics, shelters, and authorities to identify lost or stolen pets in Poland.

- **Website**: www.safe-animal.eu
- **OVF system**: `safe-animal`
- **Coverage**: Dogs, cats, and other microchipped animals registered in Poland.
- **Lookup**: Veterinarians and owners can search by microchip number to find owner contact information and pet details.

```json
{
  "identifiers": [
    {
      "system": "safe-animal",
      "value": "SAFE-2025-98765"
    }
  ]
}
```

### EUROPETNET

[EUROPETNET](https://www.europetnet.com) is the European pet identification network that connects national pet registries across Europe. When a microchipped pet registered in Poland is found in another EU country, EUROPETNET enables cross-border identification.

- **Website**: www.europetnet.com
- **OVF system**: `europetnet`
- **Members**: SAFE-ANIMAL is a member database of EUROPETNET, so Polish pets registered in SAFE-ANIMAL are also searchable via EUROPETNET.

```json
{
  "identifiers": [
    {
      "system": "europetnet",
      "value": "EPN-616000012345678"
    }
  ]
}
```

---

## EU Pet Passport

The EU Pet Passport is a standardized document required for travelling with pets within the European Union. It is issued by authorized veterinarians and contains:

- Microchip number (mandatory since 2011, replacing tattoos).
- Rabies vaccination record.
- Owner identification and address.
- Animal description (species, breed, sex, color, date of birth).

### Identifier Format

Polish EU Pet Passports use the country prefix `PL` followed by a numeric identifier:

- **OVF system**: `eu-pet-passport`

```json
{
  "identifiers": [
    {
      "system": "eu-pet-passport",
      "value": "PL-1234567"
    }
  ]
}
```

### Combined Identifiers Example

A fully identified Polish pet typically has multiple identifiers:

```json
{
  "resource_type": "Patient",
  "id": "pet-001",
  "name": "Burek",
  "species": "dog",
  "breed": "Labrador Retriever",
  "identifiers": [
    {
      "system": "iso-microchip-11784",
      "value": "616000012345678"
    },
    {
      "system": "eu-pet-passport",
      "value": "PL-1234567"
    },
    {
      "system": "safe-animal",
      "value": "SAFE-2025-98765"
    },
    {
      "system": "europetnet",
      "value": "EPN-616000012345678"
    }
  ]
}
```

---

## Breed Code Systems

OVF supports standardized breed codes via the `breed_code` field on Patient. This is particularly useful for official documentation, pedigree records, and cross-system interoperability.

### FCI (Federation Cynologique Internationale)

The [FCI](https://www.fci.be) is the largest international canine organization, and Poland's national kennel club (Zwiazek Kynologiczny w Polsce / ZKwP) is an FCI member. FCI breed codes are the standard for dog breed identification in Poland.

- **OVF system**: `fci`
- **Scope**: Dogs only.
- **Format**: Numeric code assigned to each recognized breed.

Common FCI breed codes:

| FCI Code | Breed |
|---|---|
| 122 | German Shepherd Dog |
| 166 | Labrador Retriever |
| 111 | Golden Retriever |
| 86 | French Bulldog |
| 65 | Dachshund (Standard) |
| 252 | Yorkshire Terrier |
| 218 | Siberian Husky |
| 15 | Boxer |
| 332 | Jack Russell Terrier |
| 83 | Miniature Schnauzer |

```json
{
  "breed": "Labrador Retriever",
  "breed_code": {
    "system": "fci",
    "value": "166"
  }
}
```

### FIFe (Federation Internationale Feline)

[FIFe](https://fifeweb.org) is the largest international cat registry in Europe. Poland's national cat organization (Felinologiczny Zwiazek Hodowcow Kotow Rasowych) is a FIFe member.

- **OVF system**: `fife`
- **Scope**: Cats only.
- **Format**: Three or four letter breed code (EMS code system).

Common FIFe breed codes:

| FIFe Code | Breed |
|---|---|
| PER | Persian |
| BRI | British Shorthair |
| MCO | Maine Coon |
| RAG | Ragdoll |
| BEN | Bengal |
| SBI | Sacred Birman |
| ABY | Abyssinian |
| RUS | Russian Blue |
| NFO | Norwegian Forest Cat |
| SIA | Siamese |

```json
{
  "breed": "British Shorthair",
  "breed_code": {
    "system": "fife",
    "value": "BRI"
  }
}
```

FIFe EMS codes can also include color and pattern suffixes (e.g. `BRI a` for British Shorthair Blue), but the `breed_code.value` field should contain the base breed code only.

### TICA (The International Cat Association)

[TICA](https://tica.org) is another major international cat registry recognized in Poland.

- **OVF system**: `tica`
- **Scope**: Cats only.
- **Format**: Two-letter breed code.

Common TICA breed codes:

| TICA Code | Breed |
|---|---|
| PS | Persian |
| BS | British Shorthair |
| MC | Maine Coon |
| RD | Ragdoll |
| BG | Bengal |
| BI | Birman |
| AB | Abyssinian |
| RB | Russian Blue |
| NF | Norwegian Forest Cat |
| SI | Siamese |

```json
{
  "breed": "Maine Coon",
  "breed_code": {
    "system": "tica",
    "value": "MC"
  }
}
```

---

## Complete Polish Patient Example

A fully documented Polish dog with all identifier systems and breed coding:

```json
{
  "resource_type": "Patient",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Burek",
  "species": "dog",
  "breed": "Labrador Retriever",
  "breed_code": {
    "system": "fci",
    "value": "166"
  },
  "date_of_birth": "2020-03-15",
  "sex": "male",
  "gender_status": "neutered",
  "color": "golden",
  "weight": {
    "value": 32.5,
    "unit": "kg"
  },
  "identifiers": [
    {
      "system": "iso-microchip-11784",
      "value": "616000012345678"
    },
    {
      "system": "eu-pet-passport",
      "value": "PL-1234567"
    },
    {
      "system": "safe-animal",
      "value": "SAFE-2025-98765"
    },
    {
      "system": "europetnet",
      "value": "EPN-616000012345678"
    }
  ],
  "owner": {
    "name": "Jan Kowalski",
    "phone": "+48 600 123 456",
    "email": "jan.kowalski@example.com",
    "address": "ul. Zwierzyniecka 10, 31-015 Krakow, Poland"
  },
  "is_active": true,
  "is_deceased": false,
  "notes": "Friendly but nervous during examinations. Prefers treats as positive reinforcement."
}
```

---

## Notes for Implementers

1. **Microchip validation**: Polish microchips always start with `616`. Implementations SHOULD validate that `iso-microchip-11784` values with a `616` prefix are exactly 15 digits.
2. **SAFE-ANIMAL lookup**: The SAFE-ANIMAL API (when available) can be queried by microchip number to retrieve registration status.
3. **Breed code priority**: When both FIFe and TICA codes are relevant for a cat, prefer FIFe as it is the dominant registry in Poland. Use the `x_secondary_breed_code` extension for the alternate code if needed.
4. **EU Pet Passport expiry**: The passport itself does not expire, but the rabies vaccination recorded in it does. Track vaccination expiry via the Immunization resource's `expiration_date` field.
5. **Cross-border travel**: When generating OVF documents for pets travelling within the EU, include both the `iso-microchip-11784` and `eu-pet-passport` identifiers at minimum.
