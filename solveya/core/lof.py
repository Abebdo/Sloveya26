import pickle
from typing import Optional, Union, List
import numpy as np
from sklearn.neighbors import LocalOutlierFactor
import asyncio
from pathlib import Path

class LOFAnalyzer:
    """
    Wrapper around sklearn.neighbors.LocalOutlierFactor.

    Supports both outlier detection (unsupervised) and novelty detection (semi-supervised).
    """

    def __init__(self, n_neighbors: int = 20, contamination: float = 0.1, novelty: bool = False) -> None:
        """
        Initialize the LOFAnalyzer.

        Args:
            n_neighbors: Number of neighbors to use by default for kneighbors queries.
            contamination: The amount of contamination of the data set.
            novelty: By default, LocalOutlierFactor is only used for outlier detection (novelty=False).
                     Set novelty=True if you want to use LocalOutlierFactor for novelty detection.
        """
        self.n_neighbors = n_neighbors
        self.contamination = contamination
        self.novelty = novelty
        self.model = LocalOutlierFactor(
            n_neighbors=n_neighbors,
            contamination=contamination,
            novelty=novelty,
            n_jobs=-1
        )
        self._is_fitted = False

    def fit_predict(self, X: np.ndarray) -> np.ndarray:
        """
        Fits the model to the training set X and returns the labels.

        Args:
            X: Input data.

        Returns:
            np.ndarray: Labels (1 for inliers, -1 for outliers).
        """
        if self.novelty:
            # In novelty mode, fit_predict is not the primary usage, but we can fit then predict.
            # However, predict() on training data in novelty mode is not the same as fit_predict in outlier mode.
            # fit_predict is only available when novelty=False in sklearn (usually).
            # Actually sklearn docs say fit_predict is available for novelty=False.
            # If novelty=True, we should use fit() then predict() on new data.
            # But if called, we can just fit.
            raise RuntimeError("fit_predict is not available when novelty=True. Use fit() and predict().")

        labels = self.model.fit_predict(X)
        self._is_fitted = True
        return labels

    def fit(self, X: np.ndarray) -> None:
        """
        Fit the model using X as training data.

        Args:
            X: Input data.
        """
        self.model.fit(X)
        self._is_fitted = True

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict the labels (1 inlier, -1 outlier) of X according to LOF.
        Only available for novelty=True.

        Args:
            X: Input data.

        Returns:
            np.ndarray: Predicted labels.
        """
        if not self.novelty:
            raise RuntimeError("predict is only available when novelty=True. Use fit_predict for outlier detection.")

        if not self._is_fitted:
            raise RuntimeError("Model is not fitted.")

        return self.model.predict(X)

    def get_local_reachability_distances(self) -> Optional[np.ndarray]:
        """
        Returns the local reachability distances if available.
        Sklearn does not publicly expose LRD.

        Returns:
            None: As it is not exposed by the underlying implementation.
        """
        # sklearn.neighbors.LocalOutlierFactor does not expose lrd_ publicly.
        return None

    def get_lof_scores(self) -> Optional[np.ndarray]:
        """
        Returns the Local Outlier Factor scores (negative_outlier_factor_).
        The higher the value, the more normal.
        The lower (more negative), the more abnormal.

        Returns:
            np.ndarray: The negative outlier factors.
        """
        if not self._is_fitted:
            return None

        # negative_outlier_factor_ is available after fit()
        return self.model.negative_outlier_factor_

    def get_positive_lof_scores(self) -> Optional[np.ndarray]:
        """
        Returns the LOF scores as positive values (-negative_outlier_factor_).
        Higher means more abnormal.
        """
        scores = self.get_lof_scores()
        if scores is not None:
            return -scores
        return None

    # Async wrappers

    async def fit_predict_async(self, X: np.ndarray) -> np.ndarray:
        """Async wrapper for fit_predict."""
        return await asyncio.to_thread(self.fit_predict, X)

    async def fit_async(self, X: np.ndarray) -> None:
        """Async wrapper for fit."""
        await asyncio.to_thread(self.fit, X)

    async def predict_async(self, X: np.ndarray) -> np.ndarray:
        """Async wrapper for predict."""
        return await asyncio.to_thread(self.predict, X)

    def save(self, filepath: Union[str, Path]) -> None:
        """Serialize."""
        with open(filepath, 'wb') as f:
            pickle.dump(self.model, f)

    def load(self, filepath: Union[str, Path]) -> None:
        """Deserialize."""
        with open(filepath, 'rb') as f:
            self.model = pickle.load(f)
        self._is_fitted = True
