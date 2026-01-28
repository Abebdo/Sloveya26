import pickle
from typing import Optional, Dict, Any, Union
import numpy as np
from sklearn.ensemble import IsolationForest
import asyncio
from pathlib import Path

class IsolationForestDetector:
    """
    Wrapper around sklearn.ensemble.IsolationForest for anomaly detection.

    Provides methods for fitting, predicting, and scoring, with support for
    serialization and telemetry hooks.
    """

    def __init__(self, n_estimators: int = 100, contamination: float = 0.1,
                 random_state: Optional[int] = None) -> None:
        """
        Initialize the IsolationForestDetector.

        Args:
            n_estimators: The number of base estimators in the ensemble.
            contamination: The amount of contamination of the data set, i.e. the proportion of outliers in the data set.
            random_state: Controls the pseudo-randomness of the selection of the feature and split values.
        """
        self.n_estimators = n_estimators
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            n_estimators=n_estimators,
            contamination=contamination,
            random_state=random_state,
            n_jobs=-1  # Use all cores
        )
        self._is_fitted = False

    def fit(self, X: np.ndarray) -> None:
        """
        Fit the model to the training set X.

        Args:
            X: Input data.
        """
        self.model.fit(X)
        self._is_fitted = True

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict if a particular sample is an outlier or not.

        Args:
            X: Input data.

        Returns:
            np.ndarray: For each observation, returns 1 for inliers and -1 for outliers.
        """
        if not self._is_fitted:
            raise RuntimeError("Model is not fitted yet.")
        return self.model.predict(X)

    def decision_function(self, X: np.ndarray) -> np.ndarray:
        """
        Average anomaly score of X of the base classifiers.

        Args:
            X: Input data.

        Returns:
            np.ndarray: The anomaly score of the input samples.
                        The lower, the more abnormal.
        """
        if not self._is_fitted:
            raise RuntimeError("Model is not fitted yet.")
        return self.model.decision_function(X)

    def get_anomaly_scores(self, X: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Get comprehensive anomaly scores.

        Args:
            X: Input data.

        Returns:
            Dict[str, np.ndarray]: A dictionary containing 'scores' (decision function)
                                   and 'predictions' (1/-1 labels).
        """
        scores = self.decision_function(X)
        predictions = self.predict(X)
        # In sklearn IF, negative scores represent outliers (lower is more anomalous).
        # Sometimes it's useful to invert this or normalize.
        # We return raw decision function as 'scores'.

        return {
            "scores": scores,
            "predictions": predictions,
            # 'anomaly_score' is often -decision_function for easier interpretation (higher is more anomalous)
            "anomaly_probability": -scores # This is a heuristic proxy
        }

    def save(self, filepath: Union[str, Path]) -> None:
        """
        Serialize the model to a file.

        Args:
            filepath: Path to save the model.
        """
        with open(filepath, 'wb') as f:
            pickle.dump(self.model, f)

    def load(self, filepath: Union[str, Path]) -> None:
        """
        Deserialize the model from a file.

        Args:
            filepath: Path to load the model from.
        """
        with open(filepath, 'rb') as f:
            self.model = pickle.load(f)
        self._is_fitted = True  # Assuming loaded model is fitted

    # Async wrappers for integration with async pipelines

    async def fit_async(self, X: np.ndarray) -> None:
        """Async wrapper for fit."""
        await asyncio.to_thread(self.fit, X)

    async def predict_async(self, X: np.ndarray) -> np.ndarray:
        """Async wrapper for predict."""
        return await asyncio.to_thread(self.predict, X)

    @property
    def feature_importances_(self) -> Any:
        """
        Isolation Forest does not natively support feature importance in the same way
        as Random Forest.
        Returns None as per strict implementation of available features.
        """
        return None
