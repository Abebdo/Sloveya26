import math
from typing import Union, List
import numpy as np

class ShannonEntropyCalculator:
    """
    Academic-grade Shannon Entropy Calculator for binary analysis.

    Provides methods to calculate global entropy, windowed entropy,
    and conditional entropy on binary streams.
    """

    def calculate(self, data: Union[bytes, bytearray, memoryview]) -> float:
        """
        Calculates the Shannon entropy of the given data.

        H(X) = - sum(p(x) * log2(p(x)))

        Args:
            data: Input binary data.

        Returns:
            float: The Shannon entropy in bits.

        Raises:
            ValueError: If the input data is empty.

        Time Complexity: O(N) where N is the length of data.
        """
        if not data:
            raise ValueError("Input data cannot be empty.")

        # Zero-copy conversion to numpy array
        # np.frombuffer works with bytes, bytearray, and memoryview
        arr = np.frombuffer(data, dtype=np.uint8)

        # Count occurrences of each byte value (0-255)
        # bincount is faster than unique for uint8
        counts = np.bincount(arr, minlength=256)

        # Filter out zero counts to avoid log2(0)
        # We only care about bytes that actually appear
        counts = counts[counts > 0]

        # Calculate probabilities
        probabilities = counts / len(arr)

        # Calculate entropy
        entropy = -np.sum(probabilities * np.log2(probabilities))

        return float(entropy)

    def calculate_windowed(self, data: bytes, window_size: int, step: int) -> List[float]:
        """
        Calculates Shannon entropy over a sliding window.

        Args:
            data: Input binary data.
            window_size: Size of the sliding window in bytes.
            step: Step size for moving the window.

        Returns:
            List[float]: A list of entropy values for each window.

        Raises:
            ValueError: If data is empty or window parameters are invalid.

        Time Complexity: O(N * M) where N is number of windows and M is window_size.
        """
        if not data:
            raise ValueError("Input data cannot be empty.")
        if window_size <= 0:
            raise ValueError("Window size must be positive.")
        if step <= 0:
            raise ValueError("Step size must be positive.")
        if window_size > len(data):
            # If window is larger than data, process the whole data as one window?
            # Or return empty? Standard is usually empty or single value.
            # Let's return single value of whole data if data > 0, else error is already raised.
            # Spec implies sliding window. If data < window, technically 0 windows fit.
            return []

        # Convert to numpy for slicing efficiency?
        # Python bytes slicing is also fast (copy).
        # But calculate() expects buffer-like.

        # We can optimize by using the calculate method.
        # But calling calculate repeatedly creates overhead.
        # However, for O(NM), manual implementation is acceptable.

        n = len(data)
        entropies = []

        for i in range(0, n - window_size + 1, step):
            window = data[i : i + window_size]
            entropies.append(self.calculate(window))

        return entropies

    def calculate_conditional(self, data: bytes, context_length: int) -> float:
        """
        Calculates the conditional entropy H(Y|X) where X is a sequence of
        length `context_length` and Y is the following byte.

        H(Y|X) = H(X, Y) - H(X)

        Args:
            data: Input binary data.
            context_length: The length of the context (N-gram order - 1).

        Returns:
            float: The conditional entropy.

        Raises:
            ValueError: If data is too short for the given context length.
        """
        if len(data) <= context_length:
            raise ValueError("Data length must be greater than context length.")

        if context_length < 0:
             raise ValueError("Context length must be non-negative.")

        # If context_length is 0, it reduces to simple entropy H(Y)
        if context_length == 0:
            return self.calculate(data)

        # Create N-grams (Context + Target) -> Length k+1
        # and Contexts -> Length k

        # We need efficient counting of byte sequences.
        # Using numpy strided view (sliding_window_view)

        arr = np.frombuffer(data, dtype=np.uint8)

        # N-grams of length context_length + 1
        # Example: data=[1,2,3,4], context=1. ngrams(2): [1,2], [2,3], [3,4]
        n_plus_1_grams = np.lib.stride_tricks.sliding_window_view(arr, window_shape=context_length + 1)

        # Contexts of length context_length
        # These correspond to the prefix of each n_plus_1_gram
        # Actually, we just need the sliding window of length `context_length`
        # from the start up to len(data)-1.
        # But to be mathematically consistent with H(Y|X) = H(X,Y) - H(X),
        # X and (X,Y) must assume the same probability space samples.
        # The samples are the windows starting at indices 0 to N-(k+1).

        # X samples: data[i : i+k]
        # X,Y samples: data[i : i+k+1]
        # for i in 0 .. len(data) - k - 1

        # Only consider complete (k+1)-grams
        n_samples = len(arr) - context_length
        if n_samples <= 0:
             raise ValueError("Data too short.")

        # View of X,Y (k+1 grams)
        xy_view = n_plus_1_grams # Shape (N-k, k+1)

        # View of X (k grams) - just take the first k columns of xy_view
        x_view = xy_view[:, :-1]

        # To count unique rows efficiently in numpy:
        # We can map rows to bytes or use unique(axis=0)

        # H(X, Y)
        # np.unique with return_counts=True on axis 0
        _, xy_counts = np.unique(xy_view, axis=0, return_counts=True)
        xy_probs = xy_counts / xy_counts.sum()
        h_xy = -np.sum(xy_probs * np.log2(xy_probs))

        # H(X)
        _, x_counts = np.unique(x_view, axis=0, return_counts=True)
        x_probs = x_counts / x_counts.sum()
        h_x = -np.sum(x_probs * np.log2(x_probs))

        return float(h_xy - h_x)

    def entropy_rate(self, data: bytes) -> float:
        """
        Calculates the entropy rate (entropy per byte).
        For IID source, this is just H(X).

        Args:
            data: Input binary data.

        Returns:
            float: Entropy rate.
        """
        return self.calculate(data)
