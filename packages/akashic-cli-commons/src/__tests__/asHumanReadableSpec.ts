import { asHumanReadable } from "../asHumanReadable.js";

test("asHumanReadable()", () => {
	// Bytes
	expect(asHumanReadable(0)).toBe("0 Bytes");
	expect(asHumanReadable(100)).toBe("100 Bytes");
	expect(asHumanReadable(1023)).toBe("1023 Bytes");

	// KiB
	expect(asHumanReadable(1024)).toBe("1 KiB");
	expect(asHumanReadable(2000, 1)).toBe("2.0 KiB"); // 1.953125 KiB
	expect(asHumanReadable(123456, 2)).toBe("120.56 KiB"); // 120.5625 KiB

	// MiB
	expect(asHumanReadable(1048576)).toBe("1 MiB");
	expect(asHumanReadable(123456789, 1)).toBe("117.7 MiB"); // 117.737568855 MiB

	// GiB
	expect(asHumanReadable(1073741824)).toBe("1 GiB");
	expect(asHumanReadable(12345678910, 1)).toBe("11.5 GiB"); // 11.497809467837 GiB
});
