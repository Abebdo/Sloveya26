import struct
import math
from typing import Dict, Any, Tuple, Iterator, BinaryIO, Optional, List
from dataclasses import dataclass
from solveya.core.entropy import ShannonEntropyCalculator

@dataclass
class EntropyProfile:
    """
    Data class representing the entropy profile of a binary segment.
    """
    global_entropy: float
    entropy_rate: float
    windowed_entropy_mean: float
    windowed_entropy_variance: float
    windowed_entropy_min: float
    windowed_entropy_max: float

class BinaryMetadataParser:
    """
    Robust binary parser for metadata extraction and entropy profiling.
    """

    def __init__(self, schema: Dict[str, Tuple[str, int]], magic_bytes: Optional[bytes] = None, magic_offset: int = 0) -> None:
        """
        Initialize the parser with a schema.

        Args:
            schema: Dictionary mapping field names to (struct_format, offset).
                    Example: {"header": (">I", 0), "version": ("B", 4)}
            magic_bytes: Optional magic bytes to validate at magic_offset.
            magic_offset: Offset for magic bytes validation.
        """
        self.schema = schema
        self.magic_bytes = magic_bytes
        self.magic_offset = magic_offset
        self.entropy_calculator = ShannonEntropyCalculator()

        # Calculate the minimum size required to parse one record
        self.record_size = 0
        for fmt, offset in schema.values():
            end = offset + struct.calcsize(fmt)
            if end > self.record_size:
                self.record_size = end

    def parse(self, data: bytes, offset: int = 0) -> Dict[str, Any]:
        """
        Parse a single record from the data at the given offset.

        Args:
            data: Binary data buffer.
            offset: Offset to start parsing from.

        Returns:
            Dict[str, Any]: Parsed fields.

        Raises:
            ValueError: If data is insufficient or magic bytes mismatch.
            struct.error: If parsing fails.
        """
        if offset < 0:
            raise ValueError("Offset cannot be negative.")

        if len(data) < offset + self.record_size:
            raise ValueError(f"Data length ({len(data)}) insufficient for record size ({self.record_size}) at offset {offset}.")

        # Validate magic bytes if configured
        if self.magic_bytes:
            magic_check_pos = offset + self.magic_offset
            if len(data) < magic_check_pos + len(self.magic_bytes):
                 raise ValueError("Data insufficient for magic bytes check.")

            actual_magic = data[magic_check_pos : magic_check_pos + len(self.magic_bytes)]
            if actual_magic != self.magic_bytes:
                raise ValueError(f"Invalid magic bytes. Expected {self.magic_bytes.hex()}, got {actual_magic.hex()}.")

        result = {}
        for name, (fmt, field_offset) in self.schema.items():
            try:
                # struct.unpack_from returns a tuple, we usually want the single value if it's one item
                values = struct.unpack_from(fmt, data, offset + field_offset)
                if len(values) == 1:
                    result[name] = values[0]
                else:
                    result[name] = values
            except struct.error as e:
                raise ValueError(f"Failed to parse field '{name}' at offset {offset + field_offset} with format '{fmt}': {e}") from e

        return result

    def parse_stream(self, stream: BinaryIO, chunk_size: int = 8192) -> Iterator[Dict[str, Any]]:
        """
        Parse a stream of records.

        Args:
            stream: A file-like object opened in binary mode.
            chunk_size: Buffer size for reading (not strictly used for parsing logic here as we read per record).
                        Actually, efficient implementation reads chunks.
                        But since records are fixed size (usually), we can read record_size.
                        If chunk_size is provided, we use it to buffer if needed, but simple implementation is read(record_size).

        Yields:
            Dict[str, Any]: Parsed record.
        """
        # If record_size is 0 (empty schema), we can't iterate.
        if self.record_size == 0:
            return

        while True:
            # Read exactly one record
            # Optimally we would read a large chunk and parse multiple, but that requires handling partial records.
            # Given constraints and robustness, reading record_size is safe.
            # To respect chunk_size, we could read chunk_size and iterate, but handling boundaries is complex.
            # We'll stick to reading record_size for correctness.

            # Actually, to be efficient with chunk_size:
            # We can verify if chunk_size is multiple of record_size.

            read_len = self.record_size
            data = stream.read(read_len)
            if len(data) < read_len:
                break

            yield self.parse(data, offset=0)

    def get_entropy_profile(self, data: bytes) -> EntropyProfile:
        """
        Calculates the entropy profile of the data.

        Args:
            data: Input binary data.

        Returns:
            EntropyProfile: Comprehensive entropy metrics.
        """
        global_entropy = self.entropy_calculator.calculate(data)

        # Windowed analysis for distribution statistics
        # Heuristic window size: 256 bytes or 10% of data, capped at 1024?
        # Let's use a fixed window of 256 bytes with step 128 for granularity,
        # or adapt to data length.

        window_size = 256
        step = 128

        if len(data) < window_size:
            window_size = len(data)
            step = max(1, len(data) // 2)

        windowed_entropies = self.entropy_calculator.calculate_windowed(data, window_size, step)

        if not windowed_entropies:
            # If data is empty or something went wrong
             return EntropyProfile(
                global_entropy=global_entropy,
                entropy_rate=global_entropy, # If len=0, global=0
                windowed_entropy_mean=0.0,
                windowed_entropy_variance=0.0,
                windowed_entropy_min=0.0,
                windowed_entropy_max=0.0
            )

        import statistics

        return EntropyProfile(
            global_entropy=global_entropy,
            entropy_rate=self.entropy_calculator.entropy_rate(data),
            windowed_entropy_mean=statistics.mean(windowed_entropies),
            windowed_entropy_variance=statistics.variance(windowed_entropies) if len(windowed_entropies) > 1 else 0.0,
            windowed_entropy_min=min(windowed_entropies),
            windowed_entropy_max=max(windowed_entropies)
        )
